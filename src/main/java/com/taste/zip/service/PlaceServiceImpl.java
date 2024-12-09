package com.taste.zip.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taste.zip.entity.BookmarkEntity;
import com.taste.zip.entity.MemberEntity;
import com.taste.zip.entity.PlaceEntity;
import com.taste.zip.repository.BookmarkRepository;
import com.taste.zip.repository.MemberRepository;
import com.taste.zip.repository.PlaceRepository;
import com.taste.zip.vo.PlaceVO;
import com.taste.zip.vo.PlaceVO.Item;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlaceServiceImpl implements PlaceService {

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Override
    public int insertPlace(PlaceVO data) {
        try {
            List<Item> items = data.getResponse().getBody().getItems().getItem();
            List<PlaceEntity> placeEntities = items.stream()
                    .filter(item -> item.getFirstimage() != null && !item.getFirstimage().isEmpty())
                    .map(item -> {
                        PlaceEntity entity = new PlaceEntity();
                        entity.setAddr1(item.getAddr1());
                        entity.setAreacode(item.getAreacode());
                        entity.setAreaname(item.getAreaname());
                        entity.setCat3(item.getCat3());
                        entity.setContentid(item.getContentid());
                        entity.setContenttypeid(item.getContenttypeid());
                        entity.setFirstimage(item.getFirstimage());
                        entity.setMapx(item.getMapx());
                        entity.setMapy(item.getMapy());
                        entity.setMlevel(item.getMlevel());
                        entity.setSigungucode(item.getSigungucode());
                        entity.setTel(item.getTel());
                        entity.setTitle(item.getTitle());
                        entity.setHomepage(item.getHomepage());
                        return entity;
                    })
                    .collect(Collectors.toList());

            placeRepository.saveAll(placeEntities);
            return placeEntities.size();
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public List<PlaceEntity> getPlaceList() {
        return placeRepository.findAll();
    }

    @Override
    @Transactional
    public int updateAreaName(String areaName, String sigunguName, String contentid) {
        return placeRepository.updateAreaName(areaName, sigunguName, contentid);
    }

    @Override
    public List<PlaceEntity> getPlacePage(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page - 1, size);
        return placeRepository.findAllPaged(pageRequest).getContent();
    }

    @Override
    public PlaceEntity getPlace(int placeId) {
        return placeRepository.findById(placeId)
                .orElseThrow(() -> new EntityNotFoundException("Place not found"));
    }

    @Override
    public Page<PlaceEntity> findPlaces(String category, String theme, String searchField, String searchWord, Pageable pageable) {
        if (category == null || category.isEmpty()) {
            category = "all";
        }
        if (searchField == null || searchField.isEmpty()) {
            searchField = "title";
        }
        return placeRepository.findPlaces(category, theme, searchField, searchWord, pageable);
    }
    

    @Override
    @Transactional
    public int updatePlaceDetails(PlaceEntity place) {
        try {
            placeRepository.save(place);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    @Transactional
    public int updatePlaceIntro(PlaceEntity place) {
        try {
            placeRepository.save(place);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    @Transactional
    public PlaceEntity submitPlace(PlaceEntity place) {
        return placeRepository.save(place);
    }

    @Override
    public List<PlaceEntity> searchPlaces(String keyword1, String keyword2) {
        if (keyword2 == null || keyword2.trim().isEmpty()) {
            keyword2 = null; // 두 번째 키워드가 없으면 null로 처리
        }
        return placeRepository.searchPlaces(keyword1, keyword2);
    }

    @Override
    @Transactional
    public int updateCategories() {
        Map<String, String> categories = new HashMap<>();
        categories.put("A05020100", "한식");
        categories.put("A05020200", "서양식");
        categories.put("A05020300", "일식");
        categories.put("A05020400", "중식");
        categories.put("A05020700", "이색음식점");
        categories.put("A05020900", "카페/찻집");

        int totalUpdated = 0;
        for (Map.Entry<String, String> entry : categories.entrySet()) {
            totalUpdated += placeRepository.updateCategory(entry.getValue(), entry.getKey());
        }
        return totalUpdated;
    }

    @Override
    public List<PlaceEntity> getPlacesByCategory(String category) {
        return placeRepository.findByCategory(category);
    }

    @Override
    public List<PlaceEntity> getBookmarkedPlaces(int memIdx) {
        MemberEntity member = memberRepository.findById(memIdx)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));
        List<BookmarkEntity> bookmarks = bookmarkRepository.findByMember(member);
        return bookmarks.stream()
                .map(BookmarkEntity::getPlace)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean toggleBookmark(int memIdx, int placeId) {
        MemberEntity member = memberRepository.findById(memIdx)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));
        PlaceEntity place = placeRepository.findById(placeId)
                .orElseThrow(() -> new EntityNotFoundException("Place not found"));

        Optional<BookmarkEntity> existingBookmark = bookmarkRepository.findByMemberAndPlace(member, place);
        if (existingBookmark.isPresent()) {
            bookmarkRepository.delete(existingBookmark.get());
            return false;
        } else {
            BookmarkEntity bookmark = new BookmarkEntity();
            bookmark.setMember(member);
            bookmark.setPlace(place);
            bookmarkRepository.save(bookmark);
            return true;
        }
    }

    @Override
    public boolean isBookmarked(int memIdx, int placeId) {
        MemberEntity member = memberRepository.findById(memIdx)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));
        PlaceEntity place = placeRepository.findById(placeId)
                .orElseThrow(() -> new EntityNotFoundException("Place not found"));
        return bookmarkRepository.existsByMemberAndPlace(member, place);
    }

    @Override
    public List<String> getAllThemes() {
        return placeRepository.getAllThemes();
    }

    @Override
    @Transactional
    public void updatePlace(PlaceEntity place) {
        placeRepository.save(place);
    }

    // 전체 식당 탑텐
    @Override
    public List<PlaceEntity> getTopRankedPlaces() {
        Pageable page = PageRequest.of(0, 10);
        return placeRepository.findTop10RankedPlaces(page).getContent();
    }

    // 지역별 식당 탑텐
    @Override
    public List<PlaceEntity> getTopPlacesByRegion(String region) {
        Pageable page = PageRequest.of(0, 10);
        return placeRepository.findTop10PlacesByRegion(region, page).getContent();
    }
}
