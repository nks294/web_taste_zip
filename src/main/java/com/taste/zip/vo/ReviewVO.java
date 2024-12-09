package com.taste.zip.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class ReviewVO {
    private Long reviewId;
    private String memberName; // Member's name
    private String placeTitle; // Place title
    private int rating;
    private String content;
    private Date createdDate;
    private String imageUrl;
    private int placeId;
    private String addr1;
    private String cat3;
    private String profileImage;
    private int memIdx;
    private Double avgRating;
    private Integer reviewCount;
    

}
