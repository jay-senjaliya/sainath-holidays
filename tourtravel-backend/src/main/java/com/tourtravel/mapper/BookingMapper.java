package com.tourtravel.mapper;

import com.tourtravel.dto.request.BookingRequest;
import com.tourtravel.dto.response.BookingResponse;
import com.tourtravel.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.math.BigDecimal;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BookingMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "tourPackage", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "hotel", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Booking toEntity(BookingRequest request);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.name", target = "userName")
    @Mapping(source = "tourPackage.id", target = "packageId")
    @Mapping(source = "tourPackage.title", target = "packageTitle")
    @Mapping(source = "vehicle.id", target = "vehicleId")
    @Mapping(source = "vehicle.name", target = "vehicleName")
    @Mapping(source = "hotel.id", target = "hotelId")
    @Mapping(source = "hotel.name", target = "hotelName")
    @Mapping(target = "balanceAmount", expression = "java(booking.getTotalAmount().subtract(booking.getAdvancePaid()))")
    BookingResponse toResponse(Booking booking);
}
