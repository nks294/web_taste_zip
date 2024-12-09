package com.taste.zip.vo;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AreaCodeVO {
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
        private int numOfRows;
        private int pageNo;
        private int totalCount;
        private Items items;
    }

    @Getter @Setter
    public static class Items {
        private List<AreaCode> item;
    }

    @Getter @Setter
    public static class AreaCode {
        private String code;
        private String name;
        private String rnum;
    }
}
