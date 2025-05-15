package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DietaryTags.
 */
@Entity
@Table(name = "dietary_tags")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DietaryTags implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "dietary")
    private String dietary;

    @ManyToMany
    @JoinTable(
        name = "rel_dietary_tags__post",
        joinColumns = @JoinColumn(name = "dietary_tags_id"),
        inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "dietaryTags" }, allowSetters = true)
    private Set<Post> posts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DietaryTags id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDietary() {
        return this.dietary;
    }

    public DietaryTags dietary(String dietary) {
        this.setDietary(dietary);
        return this;
    }

    public void setDietary(String dietary) {
        this.dietary = dietary;
    }

    public Set<Post> getPosts() {
        return this.posts;
    }

    public void setPosts(Set<Post> posts) {
        this.posts = posts;
    }

    public DietaryTags posts(Set<Post> posts) {
        this.setPosts(posts);
        return this;
    }

    public DietaryTags addPost(Post post) {
        this.posts.add(post);
        post.getDietaryTags().add(this);
        return this;
    }

    public DietaryTags removePost(Post post) {
        this.posts.remove(post);
        post.getDietaryTags().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DietaryTags)) {
            return false;
        }
        return id != null && id.equals(((DietaryTags) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DietaryTags{" +
            "id=" + getId() +
            ", dietary='" + getDietary() + "'" +
            "}";
    }
}
