package com.taste.zip.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "place")
@Getter
@Setter
@NoArgsConstructor
public class PlaceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "place_id")
    private int placeId;

    @Column(name = "addr1", length = 200)
    private String addr1;

    @Column(name = "areacode", length = 20)
    private String areacode;

    @Column(name = "areaname", length = 20)
    private String areaname;

    @Column(name = "cat3", length = 20)
    private String cat3;

    @Column(name = "contentid", length = 30)
    private String contentid;

    @Column(name = "contenttypeid", length = 20)
    private String contenttypeid;

    @Column(name = "firstimage", length = 150)
    private String firstimage;

    @Column(name = "mapx", length = 50)
    private String mapx;

    @Column(name = "mapy", length = 50)
    private String mapy;

    @Column(name = "mlevel", length = 10)
    private String mlevel;

    @Column(name = "sigungucode", length = 20)
    private String sigungucode;

    @Column(name = "sigunguname", length = 20)
    private String sigunguname;

    @Column(name = "tel", length = 500)
    private String tel;

    @Column(name = "title", length = 40)
    private String title;

    @Column(name = "homepage", length = 1000)
    private String homepage;

    @Column(name = "firstmenu", length = 500)
    private String firstmenu;

    @Column(name = "infocenterfood", length = 500)
    private String infocenterfood;

    @Column(name = "opentimefood", length = 1000)
    private String opentimefood;

    @Column(name = "restdatefood", length = 500)
    private String restdatefood;

    @Column(name = "treatmenu", length = 900)
    private String treatmenu;

    @Column(name = "theme")
    private String theme;

    @Column(name = "avg_rating")
    private Double avgRating;

    @Column(name = "review_count")
    private Integer reviewCount;

}
