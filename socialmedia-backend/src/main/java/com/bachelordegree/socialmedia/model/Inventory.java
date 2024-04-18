package com.bachelordegree.socialmedia.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "profile_images", joinColumns = @JoinColumn(name = "inventory_id"))
    @Column(name = "url")
    private Set<String> profilePictureUrls = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "background_images", joinColumns = @JoinColumn(name = "inventory_id"))
    @Column(name = "url")
    private Set<String> backgroundPictureUrls = new HashSet<>();

    @OneToOne(mappedBy = "inventory")
    private User user;
}