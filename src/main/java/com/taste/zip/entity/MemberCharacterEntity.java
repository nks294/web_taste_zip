package com.taste.zip.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "member_character")
public class MemberCharacterEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "mem_idx")
    private int memIdx;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "character_id")
    private CharacterEntity character;
    
    @Column(name = "is_profile_image", columnDefinition = "TINYINT DEFAULT 0")
    private boolean isProfileImage;
    
    @Column(name = "obtained_date", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime obtainedDate;
}


