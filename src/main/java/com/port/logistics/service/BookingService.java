package com.port.logistics.service;

import com.port.logistics.entity.Booking;
import com.port.logistics.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public List<Booking> fetchAllBookings() {
        return bookingRepository.findAll();
    }
}
