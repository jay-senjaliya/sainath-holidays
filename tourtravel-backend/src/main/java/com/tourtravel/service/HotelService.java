package com.tourtravel.service;

import com.tourtravel.dto.request.HotelRequest;
import com.tourtravel.dto.response.HotelResponse;
import com.tourtravel.entity.Hotel;
import com.tourtravel.exception.ResourceNotFoundException;
import com.tourtravel.mapper.HotelMapper;
import com.tourtravel.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class HotelService {

    private final HotelRepository hotelRepository;
    private final HotelMapper     hotelMapper;

    // ---- PUBLIC APIS ----

    @Transactional(readOnly = true)
    @Cacheable(value = "hotels", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<HotelResponse> getAllActiveHotels(Pageable pageable) {
        return hotelRepository.findByActiveTrue(pageable)
                .map(hotelMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public HotelResponse getHotelById(Long id) {
        Hotel hotel = hotelRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", "id", id));
        return hotelMapper.toResponse(hotel);
    }

    // ---- ADMIN APIS ----

    @Transactional
    @CacheEvict(value = "hotels", allEntries = true)
    public HotelResponse createHotel(HotelRequest request) {
        Hotel hotel = hotelMapper.toEntity(request);
        
        // Setup bi-directional relationships
        if (hotel.getAmenities() != null) {
            hotel.getAmenities().forEach(a -> a.setHotel(hotel));
        }

        Hotel saved = hotelRepository.save(hotel);
        log.info("Admin created hotel ID {}", saved.getId());
        return hotelMapper.toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = "hotels", allEntries = true)
    public HotelResponse updateHotel(Long id, HotelRequest request) {
        Hotel existing = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", "id", id));

        hotelMapper.updateEntityFromRequest(request, existing);

        // Orphan removal and re-attach for amenities
        existing.getAmenities().clear();
        if (request.getAmenities() != null) {
            request.getAmenities().forEach(dto -> {
                var amenity = hotelMapper.toAmenityEntity(dto);
                amenity.setHotel(existing);
                existing.getAmenities().add(amenity);
            });
        }

        Hotel updated = hotelRepository.save(existing);
        return hotelMapper.toResponse(updated);
    }

    @Transactional
    @CacheEvict(value = "hotels", allEntries = true)
    public void deactivateHotel(Long id) {
        Hotel existing = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", "id", id));
        existing.setActive(false);
        hotelRepository.save(existing);
        log.info("Admin deactivated hotel ID {}", id);
    }
}
