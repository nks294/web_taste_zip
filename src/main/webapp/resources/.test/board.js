$(document).ready(function () {

    $('#tab-head').off('click', '.tab').on('click', '.tab', function () {
        const contentId = $(this).attr('id').replace('thead-', '');
        const type = $('#tbody-' + contentId).find('.board, .write, .view').data('type');
        bindEvents(type);
    });

    function bindEvents(type) {
        // 글쓰기 버튼
        $('#board-' + type).off('click', '#write_btn_' + type).on('click', '#write_btn_' + type, function () {
            if (!$('#tab-body .tbody.active').length) return;
            
            $.ajax({
                url: contextPath + '/board/write.do?type=' + type,
                method: 'GET',
                success: function (data) {
                    const contentDiv = $('#tab-body .tbody.active');
                    $(contentDiv).html(data); 
                },
                error: function (jqXHR) {
                    alert('글쓰기 폼을 불러오지 못했습니다. (' + jqXHR.status + ')');
                }
            });
        });
    
        // 내용보기
        $('#board-' + type).off('click', '.board-table a').on('click', '.board-table a', function (e) {
            if (!$('#tab-body .tbody.active').length) return;
    
            e.preventDefault();
            const boardId = $(this).data('b_idx');
    
            $.ajax({
                url: '/board/view.do?id=' + boardId +'&type=' + type,
                method: 'GET',
                success: function (data) {
                    const contentDiv = $('#tab-body .tbody.active');
                    $(contentDiv).html(data); 
                },
                error: function (jqXHR) {
                    alert('게시글을 불러오는 중 오류가 발생했습니다. (' + jqXHR.status + ')');
                }
            });
        });
        
        // 검색
        $('#board-' + type).off('click', '#search_btn').on('click', '#search_btn', function (e) {
            if (!$('#tab-body .tbody.active').length) return;
    
            e.preventDefault();
            const searchField = $('select[name="searchField"]').val();
            const searchWord = $('input[name="searchWord"]').val();
    
            $.ajax({
                url: '/board/' + type,
                method: 'GET',
                data: {
                    searchField: searchField,
                    searchWord: searchWord,
                },
                success: function(data) {
                    const contentDiv = $('#tab-body .tbody.active');
                    $(contentDiv).html(data); 
                },
                error: function(jqXHR) {
                    alert('검색 결과를 불러오는 중 오류가 발생했습니다. (' + jqXHR.status + ')');
                }
            });
        });
    
        // 페이지네이션
        $('#board-' + type).off('click', '.pagination .page-link').on('click', '.pagination .page-link', function () {
            if (!$('#tab-body .tbody.active').length) return;
            
            const page = $(this).data('page'); 
            const searchField = $('select[name="searchField"]').val();
            const searchWord = $('input[name="searchWord"]').val();
    
            $.ajax({
                url: '/board/' + type,
                method: 'GET',
                data: {
                    page: page,
                    searchField: searchField,
                    searchWord: searchWord
                },
                success: function(data) {
                    const contentDiv = $('#tab-body .tbody.active');
                    $(contentDiv).html(data); 
                },
                error: function(jqXHR) {
                    alert('페이지를 불러오는 중 오류가 발생했습니다. (' + jqXHR.status + ')');
                }
            });
        });
        
        // 목록보기 버튼
        $('#view-' + type + ', #write-' + type+ ', #update-' + type).off('click', '#back_to_list').on('click', '#back_to_list', function () {
            if (!$('#tab-body .tbody.active').length) return;
            loadList();
        });

        // 수정버튼
        $('#view-' + type).off('click', '#edit_button').on('click', '#edit_button', function () {
            if (!$('#tab-body .tbody.active').length) return;
            const boardId = $('#view-' + type).data('b_idx');
    
            $.ajax({
                url: '/board/update.do?id=' + boardId +'&type=' + type,
                method: 'GET',
                success: function (data) {
                    const contentDiv = $('#tab-body .tbody.active');
                    $(contentDiv).html(data);
                },
                error: function (jqXHR) {
                    alert('수정 페이지를 불러오는 중 문제가 발생했습니다. (' + jqXHR.status + ')');
                }
            });
        });
    
        // 첨부파일 삭제 버튼
        $('input[name="deleteFiles"]').on('change', function () {
            if (!$('#tab-body .tbody.active').length) return;
            const isChecked = $(this).is(':checked');

            if (isChecked) {
                if (confirm("첨부파일을 삭제하시겠습니까?")) {
                    $(this).closest('li').hide();
                } else {
                    $(this).prop('checked', false);
                }
            }
        });

        // 작성 완료
        $('#frmBoardWrite-' + type).off('submit').on('submit', function (e) {
            if (!$('#tab-body .tbody.active').length) return;
            e.preventDefault();

            let formData = new FormData(this);
    
            $.ajax({
                url: '/board/writeProcess.do',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status === 'success') {
                        alert('글이 성공적으로 등록되었습니다.');
                        loadList();
                    } else if (response.status === 'fail') {
                        alert('글 등록에 실패했습니다. 다시 시도해 주세요.');
                    } else if (response.status === 'error') {
                        alert('오류가 발생했습니다: ' + response.message);
                    }
                },
                error: function (jqXHR) {
                    alert('글을 등록하는 중 오류가 발생했습니다. (' + jqXHR.status + ')');
                }
            });
        });
        
        // 수정 완료
        $('#frmBoardUpdate-' + type).on('submit', function (e) {
            if (!$('#tab-body .tbody.active').length) return;
            e.preventDefault();
            let formData = new FormData(this);
    
            $.ajax({
                url: '/board/updateProcess.do',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status === 'success') {
                        alert('글이 성공적으로 수정되었습니다.');
                        loadList();
                    } else if (response.status === 'fail') {
                        alert('글 수정에 실패했습니다. 다시 시도해 주세요.');
                    } else if (response.status === 'error') {
                        alert('오류가 발생했습니다: ' + response.message);
                    }
                },
                error: function (jqXHR) {
                    alert('글을 수정하는 중 오류가 발생했습니다. (' + jqXHR.status + ')');
                }
            });
        });
    
        // 삭제 완료
        $('#view-' + type).off('click', '#delete_button').on('click', '#delete_button', function () {
            if (!$('#tab-body .tbody.active').length) return;
            const boardId = $('#view-' + type).data('b_idx');
    
            if (confirm('정말 삭제하시겠습니까?')) {
                $.ajax({
                    url: '/board/deleteProcess.do?id=' + boardId,
                    method: 'POST',
                    success: function() {
                        alert('글이 삭제되었습니다.');
                        loadList();
                    },
                    error: function(jqXHR) {
                        alert('글 삭제 중 오류가 발생했습니다. (' + jqXHR.status + ')');
                    }
                });
            }
        });
    
        // 글 목록 불러오는 메소드
        function loadList() {
            $.ajax({
                url: '/board/' + type,
                method: 'GET',
                success: function (data) {
                    const contentDiv = $('#tab-body .tbody.active');
                    $(contentDiv).html(data);
                },
                error: function (jqXHR) {
                    alert('글 목록을 불러오는 중 오류가 발생했습니다. (' + jqXHR.status + ')');
                }
            });
        }
    }
    
    const initialType = $('#tab-body .tbody.active').find('.board, .write, .view').data('type');
    bindEvents(initialType);
});
