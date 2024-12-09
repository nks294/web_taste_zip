package com.taste.zip.vo;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DetailCommonVO {
    private Response response;

    @Getter @Setter
    public static class Response {
        private Header header;
        private Body body;
    }

    @Getter @Setter
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Getter @Setter
    public static class Body {
        private Items items;
        private int numOfRows;
        private int pageNo;
        private int totalCount;
    }

    @Getter @Setter
    public static class Items {
        private List<Item> item;
    }

    @Getter @Setter
    public static class Item {
        private String contentid;
        private String contenttypeid;
        private String overview;
        private String booktour;
        private String createdtime;
        private String homepage;
        private String modifiedtime;
        private String tel;
        private String telname;
        private String title;
    }
}

