package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.UserPantry;

/**
 * Spring Data JPA repository for the UserPantry entity.
 */
@Repository
public interface UserPantryRepository extends JpaRepository<UserPantry, Long> {
    @Query("select userPantry from UserPantry userPantry where userPantry.user.login = ?#{principal.username}")
    List<UserPantry> findByUserIsCurrentUser();

    default Optional<UserPantry> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<UserPantry> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<UserPantry> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct userPantry from UserPantry userPantry left join fetch userPantry.user",
        countQuery = "select count(distinct userPantry) from UserPantry userPantry"
    )
    Page<UserPantry> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct userPantry from UserPantry userPantry left join fetch userPantry.user")
    List<UserPantry> findAllWithToOneRelationships();

    @Query("select userPantry from UserPantry userPantry left join fetch userPantry.user where userPantry.id =:id")
    Optional<UserPantry> findOneWithToOneRelationships(@Param("id") Long id);
}
