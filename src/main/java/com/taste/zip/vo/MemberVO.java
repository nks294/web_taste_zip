package com.taste.zip.vo;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MemberVO {

	private int memIdx;
	private String memberId;
	private String memberPw;
	private String memberName;
	private String birthday;
	private String phone;
	private Date regDate;
	private Date modDate;
	private String memStatus;
	private int memGrade;
	private String introduction;
	private String profileImage;



}
