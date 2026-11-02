package com.only_kicks.project.service;

import com.only_kicks.project.dto.UserDto;
import com.only_kicks.project.model.Role;
import com.only_kicks.project.model.User;
import com.only_kicks.project.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<UserDto> searchUsers(
            String textSearch,
            Role role,
            Boolean active,
            Pageable pageable
    ) {
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Text search (partial match across firstName, lastName, or email)
            if (textSearch != null && !textSearch.trim().isEmpty()) {
                String searchPattern = "%" + textSearch.trim().toLowerCase() + "%";
                Predicate firstNameMatch = cb.like(cb.lower(root.get("firstName")), searchPattern);
                Predicate lastNameMatch = cb.like(cb.lower(root.get("lastName")), searchPattern);
                Predicate emailMatch = cb.like(cb.lower(root.get("email")), searchPattern);
                predicates.add(cb.or(firstNameMatch, lastNameMatch, emailMatch));
            }

            // 2. Role filter
            if (role != null) {
                predicates.add(cb.equal(root.get("role"), role));
            }

            // 3. Active status filter
            if (active != null) {
                predicates.add(cb.equal(root.get("active"), active));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return userRepository.findAll(spec, pageable).map(this::mapToDto);
    }

    private UserDto mapToDto(User user) {
        String maskedCard = "N/A";
        if (user.getCreditCard() != null && user.getCreditCard().getCardNumber() != null) {
            String fullCard = user.getCreditCard().getCardNumber();
            if (fullCard.length() >= 4) {
                maskedCard = "**** **** **** " + fullCard.substring(fullCard.length() - 4);
            } else {
                maskedCard = fullCard;
            }
        }

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .maskedCardNumber(maskedCard)
                .build();
    }
}
