package com.tourtravel.service;

import com.tourtravel.dto.request.VehicleRequest;
import com.tourtravel.dto.response.VehicleResponse;
import com.tourtravel.entity.Vehicle;
import com.tourtravel.exception.ResourceNotFoundException;
import com.tourtravel.mapper.VehicleMapper;
import com.tourtravel.repository.VehicleRepository;
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
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper     vehicleMapper;

    // ---- PUBLIC APIS ----

    @Transactional(readOnly = true)
    @Cacheable(value = "vehicles", key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #availableOnly")
    public Page<VehicleResponse> getAllVehicles(Pageable pageable, boolean availableOnly) {
        Page<Vehicle> vehicles = availableOnly
                ? vehicleRepository.findByAvailableTrue(pageable)
                : vehicleRepository.findAll(pageable);
                
        return vehicles.map(vehicleMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));
        return vehicleMapper.toResponse(vehicle);
    }

    // ---- ADMIN APIS ----

    @Transactional
    @CacheEvict(value = "vehicles", allEntries = true)
    public VehicleResponse createVehicle(VehicleRequest request) {
        Vehicle vehicle = vehicleMapper.toEntity(request);
        Vehicle saved = vehicleRepository.save(vehicle);
        log.info("Admin created vehicle ID {}", saved.getId());
        return vehicleMapper.toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = "vehicles", allEntries = true)
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle existing = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));

        vehicleMapper.updateEntityFromRequest(request, existing);
        Vehicle updated = vehicleRepository.save(existing);
        
        return vehicleMapper.toResponse(updated);
    }

    @Transactional
    @CacheEvict(value = "vehicles", allEntries = true)
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle", "id", id);
        }
        vehicleRepository.deleteById(id);
        log.info("Admin deleted vehicle ID {}", id);
    }
}
