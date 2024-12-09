package com.taste.zip.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
// import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
// import lombok.Setter;

@Entity
@Table(name = "board")
@Getter 
@NoArgsConstructor
public class NoticeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long boardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mem_idx")
    private MemberEntity member;

    @Column(name = "category")
    private String category;

    @Column(name = "title")
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "read_cnt")
    private int readCnt;

    @Column(name = "created_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Column(name = "modified_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date modifiedDate;

    @Column(name = "status", columnDefinition = "TINYINT DEFAULT 1")
    private int status;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AttachedEntity> attachments = new ArrayList<>();
    
    @Builder
    public NoticeEntity(MemberEntity member, String category, String title, String content) {
        this.member = member;
        this.category = category;
        this.title = title;
        this.content = content;
        createdDate = new Date();
        modifiedDate = new Date();
        status = 1;
    }
    
    public void updateReadCnt(int readCnt) {
        this.readCnt = readCnt;
    }

    public void updateStatus(int status) {
        this.status = status;
    }

    // @PrePersist
    // protected void onCreate() {
    //     createdDate = new Date();
    //     modifiedDate = new Date();
    //     status = 1;
    // }

    @PreUpdate
    protected void onUpdate() {
        modifiedDate = new Date();
    }
}
