package com.port.logistics.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.port.logistics.dto.BookingResponseDTO;
import com.port.logistics.entity.Booking;
import com.port.logistics.repository.BookingRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Transactional
    public BookingResponseDTO createBooking(Booking booking) {
        if (booking == null) {
            throw new RuntimeException("Booking cannot be null");
        }

        Booking savedBooking = bookingRepository.save(booking);
        return toResponseDTO(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> fetchAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private BookingResponseDTO toResponseDTO(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .userId(booking.getBookedBy() != null ? booking.getBookedBy().getId() : null)
                .containerId(booking.getContainer() != null ? booking.getContainer().getId() : null)
                .destination(booking.getDestination())
                .bookingDate(booking.getBookingDate())
                .build();
    }
}
