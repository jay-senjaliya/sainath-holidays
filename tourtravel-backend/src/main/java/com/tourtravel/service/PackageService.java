package com.tourtravel.service;

import com.tourtravel.dto.request.PackageRequest;
import com.tourtravel.dto.response.PackageDetailResponse;
import com.tourtravel.dto.response.PackageListResponse;
import com.tourtravel.entity.TourPackage;
import com.tourtravel.entity.User;
import com.tourtravel.exception.ResourceNotFoundException;
import com.tourtravel.mapper.PackageMapper;
import com.tourtravel.repository.PackageRepository;
import com.tourtravel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PackageService {

    private final PackageRepository packageRepository;
    private final UserRepository    userRepository;
    private final PackageMapper     packageMapper;

    // ---- PUBLIC APIS ----

    @Transactional(readOnly = true)
    @Cacheable(value = "packages", key = "#category + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<PackageListResponse> getAllPackages(TourPackage.PackageCategory category, Pageable pageable) {
        Page<TourPackage> pageResult = (category != null)
                ? packageRepository.findByCategoryAndActiveTrue(category, pageable)
                : packageRepository.findByActiveTrue(pageable);

        return pageResult.map(packageMapper::toListResponse);
    }

    @Transactional(readOnly = true)
    public PackageDetailResponse getPackageById(Long id) {
        TourPackage entity = packageRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("TourPackage", "id", id));
        return packageMapper.toDetailResponse(entity);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "packages_map")
    public List<PackageListResponse> getPackagesForMap() {
        // Find all active packages. The mapper will extract only lean data (lat, lng, title, price, primary image)
        return packageRepository.findAllByActiveTrue().stream()
                .map(packageMapper::toListResponse)
                .collect(Collectors.toList());
    }

    // ---- ADMIN APIS ----

    @Transactional
    @CacheEvict(value = {"packages", "packages_map"}, allEntries = true)
    public PackageDetailResponse createPackage(PackageRequest request, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", adminEmail));

        TourPackage tourPackage = packageMapper.toEntity(request);
        tourPackage.setCreatedBy(admin);

        // Bi-directional wiring
        if (tourPackage.getItineraries() != null) {
            tourPackage.getItineraries().forEach(it -> it.setTourPackage(tourPackage));
        }
        if (tourPackage.getImages() != null) {
            tourPackage.getImages().forEach(img -> img.setTourPackage(tourPackage));
        }

        TourPackage saved = packageRepository.save(tourPackage);
        log.info("Admin {} created package ID {}", adminEmail, saved.getId());
        return packageMapper.toDetailResponse(saved);
    }

    @Transactional
    @CacheEvict(value = {"packages", "packages_map"}, allEntries = true)
    public PackageDetailResponse updatePackage(Long id, PackageRequest request) {
        TourPackage existing = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TourPackage", "id", id));

        // Let MapStruct update scalar fields
        packageMapper.updateEntityFromRequest(request, existing);

        // Orphan removal and re-wiring for collections
        existing.getItineraries().clear();
        existing.getImages().clear();

        if (request.getItineraries() != null) {
            request.getItineraries().forEach(dto -> {
                var it = packageMapper.toItineraryEntity(dto);
                it.setTourPackage(existing);
                existing.getItineraries().add(it);
            });
        }

        if (request.getImages() != null) {
            request.getImages().forEach(dto -> {
                var img = packageMapper.toImageEntity(dto);
                img.setTourPackage(existing);
                existing.getImages().add(img);
            });
        }

        TourPackage updated = packageRepository.save(existing);
        return packageMapper.toDetailResponse(updated);
    }

    @Transactional
    @CacheEvict(value = {"packages", "packages_map"}, allEntries = true)
    public void deleteOrDeactivatePackage(Long id) {
        TourPackage existing = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TourPackage", "id", id));
        
        // Soft delete
        existing.setActive(false);
        packageRepository.save(existing);
        log.info("Deactivated TourPackage ID {}", id);
    }
}
