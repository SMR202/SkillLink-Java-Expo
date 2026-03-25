package com.skilllink.repository;

import com.skilllink.entity.ProviderProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {
    Optional<ProviderProfile> findByUserId(Long userId);

    @Query("SELECT p FROM ProviderProfile p JOIN p.user u WHERE u.isActive = true " +
           "AND (:query IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.bio) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:city IS NULL OR LOWER(p.city) = LOWER(:city)) " +
           "AND (:minRating IS NULL OR p.avgRating >= :minRating) " +
           "ORDER BY p.avgRating DESC")
    Page<ProviderProfile> searchProviders(
        @Param("query") String query,
        @Param("city") String city,
        @Param("minRating") Double minRating,
        Pageable pageable
    );

    @Query("SELECT p FROM ProviderProfile p JOIN p.skills s JOIN p.user u " +
           "WHERE u.isActive = true AND s.id = :categoryId " +
           "AND (:query IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:city IS NULL OR LOWER(p.city) = LOWER(:city)) " +
           "AND (:minRating IS NULL OR p.avgRating >= :minRating) " +
           "ORDER BY p.avgRating DESC")
    Page<ProviderProfile> searchProvidersByCategory(
        @Param("query") String query,
        @Param("categoryId") Long categoryId,
        @Param("city") String city,
        @Param("minRating") Double minRating,
        Pageable pageable
    );
}
