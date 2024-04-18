package com.bachelordegree.socialmedia.repository;

import com.bachelordegree.socialmedia.model.ShopItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ShopItemRepository extends JpaRepository<ShopItem, UUID>  {
}
