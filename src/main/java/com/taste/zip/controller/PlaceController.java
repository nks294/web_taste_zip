package com.taste.zip.controller;

import java.util.Collections;
import java.util.HashMap;
// import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
// import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taste.zip.api.AreaCodeApiExplorer;
import com.taste.zip.api.PlaceAreaBasedListApiExplorer;
import com.taste.zip.api.PlaceDetailCommonApiExplorer;
import com.taste.zip.api.PlaceIntroApiExplorer;
import com.taste.zip.entity.MemberEntity;
import com.taste.zip.entity.PlaceEntity;
import com.taste.zip.service.PlaceService;
import com.taste.zip.service.ReviewService;
import com.taste.zip.vo.AreaCodeVO;
import com.taste.zip.vo.AreaCodeVO.AreaCode;
import com.taste.zip.vo.DetailCommonVO;
import com.taste.zip.vo.PlaceDetailIntroVO;
import com.taste.zip.vo.PlaceVO;
import com.taste.zip.vo.ReviewVO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/places")
public class PlaceController {

    @Autowired
    private PlaceService placeService;

    @Autowired
    private ReviewService reviewService;

    private static final String SERVICE_KEY = "YwBZem4wHPLMylzzg9Oy6PTiDA94x1cmOJRsaOmTMu31f6jYqU/x2gLHziEJIpxkn7p0XTfSyJqVXIjaazct5w==";
    private static final String BASE_URL = "http://apis.data.go.kr/B551011/KorService1";
    private static final String AREA_LIST_URL = BASE_URL + "/areaBasedList1";
    private static final String AREA_CODE_URL = BASE_URL + "/areaCode1";
    private static final String DETAIL_COMMON_URL = BASE_URL + "/detailCommon1";
    private static final String DETAIL_INTRO_URL = BASE_URL + "/detailIntro1";
    private static final String NUM_OF_ROWS = "50";

    @GetMapping("/places.do")
    public String places(Model model) {
        List<PlaceEntity> initialPlaces = placeService.getPlacePage(1, 12);
        model.addAttribute("initialPlaces", initialPlaces);
        return "places/places";
    }

    @GetMapping("/api/mapPlaces")
    @ResponseBody
    public List<PlaceEntity> getMapPlaces() {
        return placeService.getPlaceList();
    }

    @GetMapping("/api/getInitialPlaces")
    @ResponseBody
    public List<PlaceEntity> getInitialPlaces() {
        return placeService.getPlacePage(1, 10); // Get first 10 places
    }

    @GetMapping("/getPlaceList")
    @ResponseBody
    public ResponseEntity<List<PlaceEntity>> getPlaceList(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "8") int size) {
        List<PlaceEntity> places = placeService.getPlacePage(page, size);
        return ResponseEntity.ok(places);
    }

    @GetMapping("/insertPlaces.do")
    @ResponseBody
    public String insertPlaces() {
        try {
            int pageNo = 1;
            int result = 0;

            while (true) {
                PlaceVO data = PlaceAreaBasedListApiExplorer.getApiJsonData(
                        SERVICE_KEY, AREA_LIST_URL, String.valueOf(pageNo), NUM_OF_ROWS, PlaceVO.class);

                if (data.getResponse().getBody().getItems().equals(""))
                    break;

                result += placeService.insertPlace(data);

                if (pageNo > 400)
                    break;
                pageNo++;
            }

            return result >= 1 ? "success" : "failed";

        } catch (Exception e) {
            log.error("Error inserting places", e);
            return "error";
        }
    }

    @GetMapping("/getAreaName.do")
    public String getAreaName() {
        try {
            AreaCodeVO area = AreaCodeApiExplorer.getApiJsonData(SERVICE_KEY, AREA_CODE_URL,
                    "1", NUM_OF_ROWS, "", AreaCodeVO.class);
            List<AreaCode> areacode = area.getResponse().getBody().getItems().getItem();

            Map<String, String> areaCodeMap = new ConcurrentHashMap<>();

            // Parallel processing for first level area codes
            areacode.parallelStream().forEach(item -> {
                areaCodeMap.put(item.getCode(), item.getName());

                try {
                    AreaCodeVO area2 = AreaCodeApiExplorer.getApiJsonData(SERVICE_KEY, AREA_CODE_URL,
                            "1", NUM_OF_ROWS, item.getCode(), AreaCodeVO.class);
                    List<AreaCode> area2code = area2.getResponse().getBody().getItems().getItem();

                    // Process second level codes
                    area2code.forEach(newItem -> {
                        String codeKey = item.getCode() + "_" + newItem.getCode();
                        areaCodeMap.put(codeKey, newItem.getName());
                    });
                } catch (Exception e) {
                    log.error("Error processing area code: " + item.getCode(), e);
                }
            });

            List<PlaceEntity> placeList = placeService.getPlaceList();

            // Parallel processing for place updates
            placeList.parallelStream().forEach(item -> {
                String areaCode = item.getAreacode();
                if (areaCode != null) {
                    String sigunguCode = areaCode + "_" + item.getSigungucode();
                    placeService.updateAreaName(
                            areaCodeMap.get(areaCode),
                            areaCodeMap.get(sigunguCode),
                            item.getContentid());
                }
            });

            return "home";
        } catch (Exception e) {
            log.error("Error updating area names", e);
            return "error";
        }
    }

    @GetMapping("/updatePlaceIntro.do")
    public String updatePlaceIntro(Model model) {
        try {
            List<PlaceEntity> allPlaces = placeService.getPlaceList();

            for (PlaceEntity place : allPlaces) {
                String contentid = place.getContentid();
                String contenttypeid = place.getContenttypeid();

                DetailCommonVO comdata = PlaceDetailCommonApiExplorer.getApiJsonData(SERVICE_KEY,
                        DETAIL_COMMON_URL, contentid, contenttypeid, DetailCommonVO.class);

                if (comdata.getResponse().getBody().getItems() == null ||
                        comdata.getResponse().getBody().getItems().getItem().isEmpty()) {
                    continue;
                }

                DetailCommonVO.Item item = comdata.getResponse().getBody().getItems().getItem().get(0);
                place.setHomepage(item.getHomepage());

                PlaceDetailIntroVO intdata = PlaceIntroApiExplorer.getApiJsonData(SERVICE_KEY,
                        DETAIL_INTRO_URL, contentid, contenttypeid, PlaceDetailIntroVO.class);

                if (intdata.getResponse().getBody().getItems() == null ||
                        intdata.getResponse().getBody().getItems().getItem().isEmpty()) {
                    continue;
                }

                PlaceDetailIntroVO.PlaceDetailIntro intItem = intdata.getResponse().getBody().getItems().getItem()
                        .get(0);

                place.setFirstmenu(intItem.getFirstmenu());
                place.setInfocenterfood(intItem.getInfocenterfood());
                place.setOpentimefood(intItem.getOpentimefood());
                place.setRestdatefood(intItem.getRestdatefood());
                place.setTreatmenu(intItem.getTreatmenu());

                placeService.updatePlaceIntro(place);
            }

            log.info("All place intro details have been updated successfully.");
            return "home";

        } catch (Exception e) {
            log.error("Error updating place intro details", e);
            return "error";
        }
    }

    @GetMapping(value = "/updateCategories.do", produces = "application/json")
    @ResponseBody
    public Map<String, Object> updateCategories() {
        Map<String, Object> response = new HashMap<>();
        try {
            int result = placeService.updateCategories();
            response.put("status", result > 0 ? "success" : "no updates needed");
            response.put("updatedCount", result);
        } catch (Exception e) {
            log.error("Error updating categories", e);
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/submit")
    public ResponseEntity<PlaceEntity> submitPlace(@RequestParam("place") String placeJson,
            HttpServletRequest request) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            PlaceEntity place = mapper.readValue(placeJson, PlaceEntity.class);
            place.setPlaceId(0);
            return ResponseEntity.ok(placeService.submitPlace(place));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getMorePlaces")
    @ResponseBody
    public List<PlaceEntity> getMorePlaces(@RequestParam int page, @RequestParam int size) {
        return placeService.getPlacePage(page, size);
    }

    @GetMapping(value = "/search", produces = "application/json")
    @ResponseBody
    public List<PlaceEntity> searchPlaces(@RequestParam String keyword) {
        // 키워드 분리
        String[] keywords = keyword.split("\\s+");
        String keyword1 = keywords.length > 0 ? keywords[0] : "";// 첫번째 키워드
        String keyword2 = keywords.length > 1 ? keywords[1] : "";// 두번째 키워드

        // 검색 실행
        return placeService.searchPlaces(keyword1, keyword2);
    }

    @GetMapping(value = "/category", produces = "application/json")
    public ResponseEntity<List<PlaceEntity>> getPlacesByCategory(@RequestParam String category) {
        List<PlaceEntity> places = placeService.getPlacesByCategory(category);
        return ResponseEntity.ok(places);
    }

    @GetMapping(value = "/api/getPlace/{placeId}", produces = "application/json")
    @ResponseBody
    public PlaceEntity getPlace(@PathVariable int placeId) {
        return placeService.getPlace(placeId);
    }

    @GetMapping("/getAllThemes")
    @ResponseBody
    public List<String> getAllThemes() {
        return placeService.getAllThemes();
    }

    @PostMapping("/update")
    public ResponseEntity<PlaceEntity> updatePlace(@RequestBody PlaceEntity place) {
        try {
            placeService.updatePlace(place);
            return ResponseEntity.ok(place);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/api/bookmarks/toggle")
    @ResponseBody
    public Map<String, Object> toggleBookmark(@RequestBody Map<String, Integer> request, HttpSession session) {
        MemberEntity member = (MemberEntity) session.getAttribute("member");
        Map<String, Object> response = new HashMap<>();

        if (member == null) {
            response.put("success", false);
            response.put("message", "로그인이 필요합니다.");
            return response;
        }

        boolean isBookmarked = placeService.toggleBookmark(member.getMemIdx(), request.get("placeId"));
        response.put("success", true);
        response.put("bookmarked", isBookmarked);
        return response;
    }

    @GetMapping("/api/bookmarks")
    @ResponseBody
    public List<PlaceEntity> getBookmarkedPlaces(HttpSession session) {
        MemberEntity member = (MemberEntity) session.getAttribute("member");
        if (member == null) {
            return Collections.emptyList();
        }
        return placeService.getBookmarkedPlaces(member.getMemIdx());
    }

    @GetMapping("/api/bookmarks/check/{placeId}")
    @ResponseBody
    public ResponseEntity<Boolean> isBookmarked(@PathVariable int placeId, HttpSession session) {
        MemberEntity member = (MemberEntity) session.getAttribute("member");
        if (member == null) {
            return ResponseEntity.ok(false);
        }
        boolean isBookmarked = placeService.isBookmarked(member.getMemIdx(), placeId);
        return ResponseEntity.ok(isBookmarked);
    }

    @GetMapping("/api/bookmarks/{memberId}")
    @ResponseBody
    public List<PlaceEntity> getBookmarkedPlaces(@PathVariable int memberId) {
        return placeService.getBookmarkedPlaces(memberId);
    }

    @GetMapping("/api/places/{placeId}/stats")
    @ResponseBody
    public Map<String, Object> getPlaceStats(@PathVariable int placeId) {
        Map<String, Object> stats = new HashMap<>();
        List<ReviewVO> reviews = reviewService.getReviewsByPlace(placeId);

        double avgRating = reviews.stream()
                .mapToInt(ReviewVO::getRating)
                .average()
                .orElse(0.0);

        // Round to 1 decimal place
        avgRating = Math.round(avgRating * 10.0) / 10.0;

        // Update place entity with new stats
        PlaceEntity place = placeService.getPlace(placeId);
        place.setAvgRating(avgRating);
        place.setReviewCount(reviews.size());
        placeService.updatePlace(place);

        stats.put("avgRating", avgRating);
        stats.put("reviewCount", reviews.size());
        return stats;
    }

    // 전체 식당 탑텐
    @GetMapping(value = "/rank", produces = "application/json")
    public ResponseEntity<List<PlaceEntity>> getPlaceRankings() {
        List<PlaceEntity> rankings = placeService.getTopRankedPlaces();
        return ResponseEntity.ok(rankings);
    }

    // 지역별 식당 탑텐
    @GetMapping(value = "/region", produces = "application/json")
    public ResponseEntity<List<PlaceEntity>> getPlacesByRegion(@RequestParam String region) {
        List<PlaceEntity> places = placeService.getTopPlacesByRegion(region);
        return ResponseEntity.ok(places);
    }

    // 플레이스 불러오는 통합 메서드
    @GetMapping(value = "/searchOrCategory", produces = "application/json")
    public ResponseEntity<Page<PlaceEntity>> searchOrCategory(
            @RequestParam(defaultValue = "all") String category,
            @RequestParam(required = false) String theme,
            @RequestParam(defaultValue = "title") String searchField,
            @RequestParam(required = false) String searchWord,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<PlaceEntity> places = placeService.findPlaces(category, theme, searchField, searchWord, pageable);
        return ResponseEntity.ok(places);
    }

}
