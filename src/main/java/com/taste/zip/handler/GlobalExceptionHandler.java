package com.taste.zip.handler;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;

import org.springframework.core.annotation.Order;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Order(1) // 우선순위 설정: 최우선순위 -1(낮을수록 높은 우선순위를 가짐)
@ControllerAdvice // 모든 컨트롤러에 대한 예외 처리
public class GlobalExceptionHandler {

	// 모든 예외에 대한 처리
	@ExceptionHandler(Exception.class)
	public String handleException(Exception e, HttpServletRequest request, Model model) {

		// 예외 정보 구성
		model.addAttribute("time", Calendar.getInstance().getTime());// 예외 발생 시간
		model.addAttribute("url", request.getServletPath());// 예외 발생 URL
		model.addAttribute("message", e.getMessage());// 예외 메시지
		// 예외 상세내용
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		e.printStackTrace(pw); // 스택 트레이스를 PrintWriter로 출력
		String stackTrace = sw.toString(); // 문자열로 변환
		model.addAttribute("stackTrace", stackTrace);

		return "error";
	}
}
