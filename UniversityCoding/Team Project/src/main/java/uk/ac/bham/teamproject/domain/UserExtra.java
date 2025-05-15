package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserExtra.
 */
@Entity
@Table(name = "user_extra")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserExtra implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "profile_pic")
    private byte[] profilePic;

    @Column(name = "profile_pic_content_type")
    private String profilePicContentType;

    @Column(name = "biography")
    private String biography;

    @Lob
    @Column(name = "profile_banner")
    private byte[] profileBanner;

    @Column(name = "profile_banner_content_type")
    private String profileBannerContentType;

    @Column(name = "age")
    private Integer age;

    @Column(name = "pronouns")
    private String pronouns;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserExtra id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getProfilePic() {
        return this.profilePic;
    }

    public UserExtra profilePic(byte[] profilePic) {
        this.setProfilePic(profilePic);
        return this;
    }

    public void setProfilePic(byte[] profilePic) {
        this.profilePic = profilePic;
    }

    public String getProfilePicContentType() {
        return this.profilePicContentType;
    }

    public UserExtra profilePicContentType(String profilePicContentType) {
        this.profilePicContentType = profilePicContentType;
        return this;
    }

    public void setProfilePicContentType(String profilePicContentType) {
        this.profilePicContentType = profilePicContentType;
    }

    public String getBiography() {
        return this.biography;
    }

    public UserExtra biography(String biography) {
        this.setBiography(biography);
        return this;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public byte[] getProfileBanner() {
        return this.profileBanner;
    }

    public UserExtra profileBanner(byte[] profileBanner) {
        this.setProfileBanner(profileBanner);
        return this;
    }

    public void setProfileBanner(byte[] profileBanner) {
        this.profileBanner = profileBanner;
    }

    public String getProfileBannerContentType() {
        return this.profileBannerContentType;
    }

    public UserExtra profileBannerContentType(String profileBannerContentType) {
        this.profileBannerContentType = profileBannerContentType;
        return this;
    }

    public void setProfileBannerContentType(String profileBannerContentType) {
        this.profileBannerContentType = profileBannerContentType;
    }

    public Integer getAge() {
        return this.age;
    }

    public UserExtra age(Integer age) {
        this.setAge(age);
        return this;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getPronouns() {
        return this.pronouns;
    }

    public UserExtra pronouns(String pronouns) {
        this.setPronouns(pronouns);
        return this;
    }

    public void setPronouns(String pronouns) {
        this.pronouns = pronouns;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserExtra user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserExtra)) {
            return false;
        }
        return id != null && id.equals(((UserExtra) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserExtra{" +
            "id=" + getId() +
            ", profilePic='" + getProfilePic() + "'" +
            ", profilePicContentType='" + getProfilePicContentType() + "'" +
            ", biography='" + getBiography() + "'" +
            ", profileBanner='" + getProfileBanner() + "'" +
            ", profileBannerContentType='" + getProfileBannerContentType() + "'" +
            ", age=" + getAge() +
            ", pronouns='" + getPronouns() + "'" +
            "}";
    }
}
