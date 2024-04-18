package com.bachelordegree.socialmedia.repository;

import com.bachelordegree.socialmedia.model.StoreItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StoreItemRepository extends JpaRepository<StoreItem, UUID>  {
}
