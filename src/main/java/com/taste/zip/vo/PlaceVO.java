package com.taste.zip.vo;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceVO {
    private Response response;

    @Getter
    @Setter
    public static class Response {
        private Header header;
        private Body body;
    }

    @Getter
    @Setter
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Getter
    @Setter
    public static class Body {
        private Items items;
        private int numOfRows;
        private int pageNo;
        private int totalCount;
    }

    @Getter
    @Setter
    public static class Items {
        private List<Item> item;
    }

    @Getter
    @Setter
    public static class Item {

        private String addr1; // 주소
        private String addr2; // 상세주소
        private String homepage;
        private String areacode; // 지역코드
        private String areaname; // 지역이름
        private String booktour; // 교과서속여행지 여부
        private String cat1; // 대분류
        private String cat2; // 중분류
        private String cat3; // 소분류
        private String contentid; // 콘텐츠ID
        private String contenttypeid; // 콘텐츠타입ID
        private String createdtime; // 등록일
        private String firstimage; // 대표이미지(원본)
        private String firstimage2; // 대표이미지(썸네일)
        private String cpyrhtDivCd; // 저작권 유형
        private String mapx; // GPS X좌표
        private String mapy; // GPS Y좌표
        private String mlevel; // Map Level
        private String readcount;
        private String modifiedtime; // 수정일
        private String sigungucode; // 시군구코드
        private String tel; // 전화번호
        private String title; // 제목
        private String zipcode; // 우편번호
        private String info;

    }
}
