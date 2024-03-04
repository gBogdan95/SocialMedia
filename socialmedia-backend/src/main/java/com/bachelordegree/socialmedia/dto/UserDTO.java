package com.bachelordegree.socialmedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.UUID;

@Data
@AllArgsConstructor
public class UserDTO {
    private UUID id;
    private String username;
    private String email;
    private Collection<? extends GrantedAuthority> authorities;
}
