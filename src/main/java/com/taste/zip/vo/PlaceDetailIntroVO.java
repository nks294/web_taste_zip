package com.taste.zip.vo;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceDetailIntroVO {
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
        private List<PlaceDetailIntro> item;
    }

    @Getter
    @Setter
    public static class PlaceDetailIntro {
        private String contentid;
        private String contenttypeid;

        // Restaurant
        private String chkcreditcardfood;
        private String discountinfofood;
        private String firstmenu;
        private String infocenterfood;
        private String kidsfacility;
        private String opendatefood;
        private String opentimefood;
        private String packing;
        private String parkingfood;
        private String reservationfood;
        private String restdatefood;
        private String scalefood;
        private String seat;
        private String smoking;
        private String treatmenu;
        private String lcnsno;
    }
}
