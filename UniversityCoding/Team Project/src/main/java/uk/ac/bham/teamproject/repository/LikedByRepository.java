package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.LikedBy;

/**
 * Spring Data JPA repository for the LikedBy entity.
 */
@Repository
public interface LikedByRepository extends JpaRepository<LikedBy, Long> {
    @Query("select likedBy from LikedBy likedBy where likedBy.user.login = ?#{principal.username}")
    List<LikedBy> findByUserIsCurrentUser();

    default Optional<LikedBy> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<LikedBy> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<LikedBy> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct likedBy from LikedBy likedBy left join fetch likedBy.user",
        countQuery = "select count(distinct likedBy) from LikedBy likedBy"
    )
    Page<LikedBy> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct likedBy from LikedBy likedBy left join fetch likedBy.user")
    List<LikedBy> findAllWithToOneRelationships();

    @Query("select likedBy from LikedBy likedBy left join fetch likedBy.user where likedBy.id =:id")
    Optional<LikedBy> findOneWithToOneRelationships(@Param("id") Long id);
}
