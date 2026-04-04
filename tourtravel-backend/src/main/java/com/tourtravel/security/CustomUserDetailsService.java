package com.tourtravel.security;

import com.tourtravel.entity.User;
import com.tourtravel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Loads user by email or phone number for JWT and form-based authentication.
 * Spring Security calls this during every request that goes through the JWT filter.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Username can be an email or a phone number (both are unique identifiers).
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .or(() -> userRepository.findByPhone(username))
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with identifier: " + username));

        return org.springframework.security.core.userdetails.User.builder()
                .username(resolveIdentifier(user))
                .password(user.getPasswordHash() != null ? user.getPasswordHash() : "")
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
                .accountExpired(false)
                .accountLocked(!user.isActive())
                .credentialsExpired(false)
                .disabled(!user.isActive())
                .build();
    }

    private String resolveIdentifier(User user) {
        return user.getEmail() != null ? user.getEmail() : user.getPhone();
    }
}
