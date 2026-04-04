package com.tourtravel.repository;

import com.tourtravel.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Page<Vehicle> findByAvailableTrue(Pageable pageable);

    Page<Vehicle> findByVehicleType(Vehicle.VehicleType vehicleType, Pageable pageable);
}
