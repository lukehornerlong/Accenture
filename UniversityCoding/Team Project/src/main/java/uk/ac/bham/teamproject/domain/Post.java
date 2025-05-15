package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Post.
 */
@Entity
@Table(name = "post")
@EntityListeners(MyEntityListener.class)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Post implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "post_title")
    private String postTitle;

    @Lob
    @Column(name = "post_pic")
    private byte[] postPic;

    @Column(name = "post_pic_content_type")
    private String postPicContentType;

    @Column(name = "post_desc")
    private String postDesc;

    @Column(name = "timestamp")
    private Instant timestamp;

    @Column(name = "likes")
    private Integer likes;

    @Column(name = "affordability")
    private Integer affordability;

    @Column(name = "simplicity")
    private Integer simplicity;

    @Column(name = "shelf_life")
    private Integer shelfLife;

    @ManyToOne
    private User user;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "rel_post__dietary_tags",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "dietary_tags_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "posts" }, allowSetters = true)
    private Set<DietaryTags> dietaryTags = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Post id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPostTitle() {
        return this.postTitle;
    }

    public Post postTitle(String postTitle) {
        this.setPostTitle(postTitle);
        return this;
    }

    public void setPostTitle(String postTitle) {
        this.postTitle = postTitle;
    }

    public byte[] getPostPic() {
        return this.postPic;
    }

    public Post postPic(byte[] postPic) {
        this.setPostPic(postPic);
        return this;
    }

    public void setPostPic(byte[] postPic) {
        this.postPic = postPic;
    }

    public String getPostPicContentType() {
        return this.postPicContentType;
    }

    public Post postPicContentType(String postPicContentType) {
        this.postPicContentType = postPicContentType;
        return this;
    }

    public void setPostPicContentType(String postPicContentType) {
        this.postPicContentType = postPicContentType;
    }

    public String getPostDesc() {
        return this.postDesc;
    }

    public Post postDesc(String postDesc) {
        this.setPostDesc(postDesc);
        return this;
    }

    public void setPostDesc(String postDesc) {
        this.postDesc = postDesc;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public Post timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Integer getLikes() {
        return this.likes;
    }

    public Post likes(Integer likes) {
        this.setLikes(likes);
        return this;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Integer getAffordability() {
        return this.affordability;
    }

    public Post affordability(Integer affordability) {
        this.setAffordability(affordability);
        return this;
    }

    public void setAffordability(Integer affordability) {
        this.affordability = affordability;
    }

    public Integer getSimplicity() {
        return this.simplicity;
    }

    public Post simplicity(Integer simplicity) {
        this.setSimplicity(simplicity);
        return this;
    }

    public void setSimplicity(Integer simplicity) {
        this.simplicity = simplicity;
    }

    public Integer getShelfLife() {
        return this.shelfLife;
    }

    public Post shelfLife(Integer shelfLife) {
        this.setShelfLife(shelfLife);
        return this;
    }

    public void setShelfLife(Integer shelfLife) {
        this.shelfLife = shelfLife;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Post user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<DietaryTags> getDietaryTags() {
        return this.dietaryTags;
    }

    public void setDietaryTags(Set<DietaryTags> dietaryTags) {
        this.dietaryTags = dietaryTags;
    }

    public Post dietaryTags(Set<DietaryTags> dietaryTags) {
        this.setDietaryTags(dietaryTags);
        return this;
    }

    public Post addDietaryTags(DietaryTags dietaryTags) {
        this.dietaryTags.add(dietaryTags);
        dietaryTags.getPosts().add(this);
        return this;
    }

    public Post removeDietaryTags(DietaryTags dietaryTags) {
        this.dietaryTags.remove(dietaryTags);
        dietaryTags.getPosts().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Post)) {
            return false;
        }
        return id != null && id.equals(((Post) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Post{" +
            "id=" + getId() +
            ", postTitle='" + getPostTitle() + "'" +
            ", postPic='" + getPostPic() + "'" +
            ", postPicContentType='" + getPostPicContentType() + "'" +
            ", postDesc='" + getPostDesc() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            ", likes=" + getLikes() +
            ", affordability=" + getAffordability() +
            ", simplicity=" + getSimplicity() +
            ", shelfLife=" + getShelfLife() +
            "}";
    }
}
