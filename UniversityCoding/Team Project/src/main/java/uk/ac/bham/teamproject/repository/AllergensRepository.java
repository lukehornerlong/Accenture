package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Allergens;

/**
 * Spring Data JPA repository for the Allergens entity.
 */
@Repository
public interface AllergensRepository extends JpaRepository<Allergens, Long> {
    default Optional<Allergens> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Allergens> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Allergens> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct allergens from Allergens allergens left join fetch allergens.user",
        countQuery = "select count(distinct allergens) from Allergens allergens"
    )
    Page<Allergens> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct allergens from Allergens allergens left join fetch allergens.user")
    List<Allergens> findAllWithToOneRelationships();

    @Query("select allergens from Allergens allergens left join fetch allergens.user where allergens.id =:id")
    Optional<Allergens> findOneWithToOneRelationships(@Param("id") Long id);
}
