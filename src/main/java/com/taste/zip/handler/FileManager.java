package com.taste.zip.handler;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileManager {

	public List<String> handleReviewImages(List<MultipartFile> images, HttpServletRequest request) {
		List<String> imageUrls = new ArrayList<>();

		for (MultipartFile image : images) {
			if (image != null && !image.isEmpty()) {
				String imageUrl = handleReviewImage(image, request);
				if (imageUrl != null) {
					imageUrls.add(imageUrl);
				}
			}
		}
		return imageUrls;
	}

	public String handleReviewImage(MultipartFile imageFile, HttpServletRequest request) {
		if (imageFile != null && !imageFile.isEmpty()) {
			try {
				String rootPath = request.getSession().getServletContext().getRealPath("/");
				String serverUploadDir = rootPath + "resources/uploads/reviews/";

				String projectPath = "C:/Workspace";
				String uploadDir = projectPath + "/taste_zip/src/main/webapp/resources/uploads/reviews/";

				File dir = new File(uploadDir);
				if (!dir.exists()) {
					boolean created = dir.mkdirs();
					System.out.println("Directory created: " + created);
					System.out.println("Directory path: " + dir.getAbsolutePath());
				}

				String originFileName = imageFile.getOriginalFilename();
				String ext = originFileName.substring(originFileName.lastIndexOf("."));
				String saveFileName = new SimpleDateFormat("yyyyMMdd_HmsS").format(new Date()) + ext;
				String fullPath = uploadDir + saveFileName;

				File saveFileToServer = new File(serverUploadDir + saveFileName);
				File saveFile = new File(fullPath);

				imageFile.transferTo(saveFileToServer);
				imageFile.transferTo(saveFile);
				System.out.println("File saved to: " + fullPath);

				return "/resources/uploads/reviews/" + saveFileName;

			} catch (Exception e) {
				System.out.println("Error saving file: " + e.getMessage());
				e.printStackTrace();
			}
		}
		return null;
	}

	public void download(String origin_filename, String save_filename, HttpServletRequest request,
			HttpServletResponse response) {

		try {
			String saveDirectory = request.getServletContext().getRealPath("resources/uploads/");
			System.out.println("FileManager.java: saveDirectory - " + saveDirectory);
			File file = new File(saveDirectory, save_filename);
			InputStream in = new FileInputStream(file);

			String client = request.getHeader("User-Agent");
			if (client.indexOf("WOW64") == -1) {
				origin_filename = new String(origin_filename.getBytes("UTF-8"), "ISO-8859-1");
			} else {
				origin_filename = new String(origin_filename.getBytes("KSC5601"), "ISO-8859-1");
			}

			response.reset();
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=\"" + origin_filename + "\"");
			response.setHeader("Content-Length", "" + file.length());

			OutputStream out = response.getOutputStream();

			byte[] buffer = new byte[(int) file.length()];
			int readBuffer = 0;
			while ((readBuffer = in.read(buffer)) > 0) {
				out.write(buffer, 0, readBuffer);
			}

			in.close();
			out.close();

		} catch (Exception e) {
			System.out.println("다운로드 중 예외발생: " + e);
		}
	}
}
