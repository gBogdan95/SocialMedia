package com.bachelordegree.socialmedia.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.util.UUID;


@Entity
@Table(name = "replies")
@Data
@NoArgsConstructor
public class Reply {
    @Id
    @Column(name = "reply_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NonNull
    @Column(name = "text", nullable = false)
    private String text;

    @Column(name = "likes", nullable = false)
    private int likes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private Comment comment;
}