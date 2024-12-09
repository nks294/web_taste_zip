package com.taste.zip.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taste.zip.entity.MemberCharacterEntity;
import com.taste.zip.entity.MemberEntity;
import com.taste.zip.service.CharacterService;
import com.taste.zip.service.MemberService;
import com.taste.zip.vo.CharacterResponseVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class CharacterController {
    private final CharacterService characterService;
    private final MemberService memberService;

    @PostMapping(value = "/random/{memIdx}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MemberCharacterEntity> getRandomCharacter(@PathVariable int memIdx) {
        MemberCharacterEntity memberCharacter = characterService.getRandomCharacter(memIdx);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(memberCharacter);
    }

    @GetMapping(value = "/member/{memIdx}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CharacterResponseVO>> getCharactersByMember(@PathVariable int memIdx) {
        List<CharacterResponseVO> characters = characterService.getCharactersByMemIdx(memIdx);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(characters);
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CharacterResponseVO>> getAllCharacters() {
        List<CharacterResponseVO> characters = characterService.getAllCharacters();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(characters);
    }
    
    @GetMapping("/points/{memIdx}")
    public ResponseEntity<Integer> getCurrentPoints(@PathVariable int memIdx) {
        Optional<MemberEntity> member = memberService.getMember(memIdx);
        return ResponseEntity.ok(member.get().getPoint());
    }

    @PostMapping("/points/add/{memIdx}")
    public ResponseEntity<Integer> addPoints(@PathVariable int memIdx, @RequestBody Map<String, Integer> payload) {
        characterService.addPoints(memIdx, payload.get("points"));
        Optional<MemberEntity> member = memberService.getMember(memIdx);
        return ResponseEntity.ok(member.get().getPoint());
    }

}
