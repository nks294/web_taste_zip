$(document).ready(function () {
    
    const loadReviewsButton = $('#loadReviews');
    const calculateButton = $('#calculateButton');
    const deleteAllButton = $('#deleteAllReviews'); // 전체 삭제 버튼
    const reviewCountText = $('#reviewCount');
    const groupedReviewsContainer = $('#loadedReviewsContainer');

    let currentPage = 0; // 현재 페이지 번호
    const pageSize = 10; // 한 번에 불러올 리뷰 수
    let totalReviewsLoaded = 0; // 총 불러온 리뷰 수

    // 초기 상태
    calculateButton.prop('disabled', true);
    deleteAllButton.prop('disabled', true);

    // 리뷰 불러오기 및 추가로 불러오기 버튼 클릭
    loadReviewsButton.on('click', function () {
        $.ajax({
            url: '/api/reviews/all',
            method: 'GET',
            dataType: 'json',
            data: {
                page: currentPage,
                size: pageSize,
            },
            success: function (response) {
                const reviews = response.content;
                totalReviewsLoaded += reviews.length;

                // 리뷰를 컨테이너에 추가
                reviews.forEach((review) => {
                    groupedReviewsContainer.append(`
                        <div class="review-item" data-review-id="${review.reviewId}">
                            <p><strong>Review ID:</strong> ${review.reviewId}</p>
                            <p><strong>Member ID:</strong> ${review.memIdx}</p>
                            <p class="review-content"><strong>Content:</strong> ${review.content}</p>
                            <p><strong>Rating:</strong> ${review.rating}</p>
                        </div>
                    `);
                });

                // 리뷰 개수 표시
                reviewCountText.text(`${totalReviewsLoaded}개의 리뷰를 불러왔습니다.`);

                // 중복 리뷰 찾기 버튼 활성화
                calculateButton.prop('disabled', false);

                // 버튼 텍스트 변경
                loadReviewsButton.text('추가로 불러오기');

                // 페이지 번호 증가
                currentPage++;
            },
            error: function () {
                alert('리뷰를 불러오는 데 실패했습니다.');
            },
        });
    });

    // 중복 리뷰 찾기 버튼 클릭
    calculateButton.on('click', function () {
        calculateSimilarity(); // 중복 리뷰 찾기 함수 호출

        // 중복 리뷰 찾기 후 "전체 삭제" 버튼 활성화
        deleteAllButton.prop('disabled', false);
    });
    
    function computeTF(wordList) {
        let tf = {};
        let totalWords = wordList.length;

        wordList.forEach(word => {
            if (!tf[word]) {
                tf[word] = 1;
            } else {
                tf[word] += 1;
            }
        });

        for (let word in tf) {
            tf[word] = tf[word] / totalWords;
        }

        return tf;
    }

    function computeIDF(reviews) {
        let idf = {};
        let totalReviews = reviews.length;
        let wordDocumentCounts = {};

        reviews.forEach(review => {
            let uniqueWords = new Set(review.content.toLowerCase().split(/\s+/));
            uniqueWords.forEach(word => {
                if (!wordDocumentCounts[word]) {
                    wordDocumentCounts[word] = 1;
                } else {
                    wordDocumentCounts[word] += 1;
                }
            });
        });

        for (let word in wordDocumentCounts) {
            idf[word] = Math.log(totalReviews / (1 + wordDocumentCounts[word]));
        }

        return idf;
    }

    function computeTFIDF(review, tf, idf) {
        let tfidf = {};
        let words = review.content.toLowerCase().split(/\s+/);
        words.forEach(word => {
            if (tf[word] && idf[word]) {
                tfidf[word] = tf[word] * idf[word];
            }
        });
        return tfidf;
    }

    function cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let magA = 0;
        let magB = 0;

        let allWords = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

        allWords.forEach(word => {
            dotProduct += (vecA[word] || 0) * (vecB[word] || 0);
            magA += (vecA[word] || 0) * (vecA[word] || 0);
            magB += (vecB[word] || 0) * (vecB[word] || 0);
        });

        return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB)) || 0;
    }

    function levenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;
        const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j - 1] + 1,
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1
                    );
                }
            }
        }
        return 1 - (dp[m][n] / Math.max(m, n));
    }

    function calculateSimilarity() {
        let reviews = document.querySelectorAll('.review-item');
        let reviewData = [];

        reviews.forEach((review) => {
            let id = review.getAttribute('data-review-id');
            let content = review.querySelector('.review-content').textContent.trim();
            let rating = review.querySelector('p:nth-child(3)').textContent.split(': ')[1].trim();
            let memIdx = review.querySelector('p:nth-child(2)').textContent.split(': ')[1].trim();
            
            reviewData.push({
                id: id,
                content: content,
                rating: rating,
                memIdx: memIdx
            });
        });

        let idf = computeIDF(reviewData);
        let results = document.getElementById('groupedReviewsContainer');
        
        for (let i = 0; i < reviewData.length; i++) {
            let tf = computeTF(reviewData[i].content.toLowerCase().split(/\s+/));
            let tfidf = computeTFIDF(reviewData[i], tf, idf);

            let similarReviews = [];
            for (let j = 0; j < reviewData.length; j++) {
                if (i !== j) {
                    let tf2 = computeTF(reviewData[j].content.toLowerCase().split(/\s+/));
                    let tfidf2 = computeTFIDF(reviewData[j], tf2, idf);

                    let cosineSim = cosineSimilarity(tfidf, tfidf2);
                    let levenSim = levenshteinDistance(reviewData[i].content, reviewData[j].content);
                    let similarity = (cosineSim + levenSim) / 2;

                    if (similarity >= 0.5) {
                        similarReviews.push({
                            review: reviewData[j],
                            similarity: similarity
                        });
                    }
                }
            }

            if (similarReviews.length > 0) {
                let resultHTML = '<div class="similarity-group">' +
                    '<div class="original-review">' +
                    '<p class="com-flex-row com-flex-align-center com-flex-justify-spacebetween"><strong>Review ID: ' + reviewData[i].id + '</strong><button class="delete-review com-btn-primary com-round-5">삭제</button></p>' +
                    '<p>Member ID: ' + reviewData[i].memIdx + '</p>' +
                    '<p>Content: ' + reviewData[i].content + '</p>' +
                    // '<p>Rating: ' + reviewData[i].rating + '</p>' +
                    '</div>' +
                    '<button class="toggle-similar com-btn-secondary com-border com-round-5">비슷한 내용의 리뷰 (' + similarReviews.length + ')</button>' +
                    '<div class="similar-reviews">';

                similarReviews.forEach(item => {
                    resultHTML += '<div class="similar-review">' +
                        '<div>' +
                        '<p><strong>Review ID: ' + item.review.id + '</strong></p>' +
                        '<p>Member ID: ' + item.review.memIdx + '</p>' +
                        '<p>Content: ' + item.review.content + '</p>' +
                        // '<p>Rating: ' + item.review.rating + '</p>' +
                        '</div>' +
                        '<div class="similarity-score">' + (item.similarity * 100).toFixed(0) + '% Match</div>' +
                        '</div>';
                });

                resultHTML += '</div></div>';

                let resultDiv = document.createElement('div');
                resultDiv.innerHTML = resultHTML;
                results.appendChild(resultDiv);

                let toggleButton = resultDiv.querySelector('.toggle-similar');
                let originalText = toggleButton.textContent;

                toggleButton.addEventListener('click', function(e) {
                    let similarReviews = e.target.nextElementSibling;
                    similarReviews.classList.toggle('expanded');
                    e.target.textContent = similarReviews.classList.contains('expanded') 
                        ? '숨기기'
                        : originalText;
                });
            }
        }
    }

    $(document).on('click', '.delete-review', function() {
        const reviewId = $(this).closest('.similarity-group').find('.original-review strong').text().split(': ')[1];
        
        if (confirm('이 리뷰를 삭제하시겠습니까?')) {
            $.ajax({
                url: `/api/reviews/${reviewId}`,
                type: 'DELETE',
                success: function() {
                    $(this).closest('.similarity-group').remove();
                    alert('리뷰가 삭제되었습니다.');
                    location.reload();
                },
                error: function() {
                    alert('리뷰 삭제에 실패했습니다.');
                }
            });
        }
    });

    // Delete all reviews button handler
    $('#deleteAllReviews').click(function() {
        if (confirm('모든 유사 리뷰를 삭제하시겠습니까?')) {
            const reviewGroups = $('.similarity-group');
            let deletePromises = [];

            reviewGroups.each(function() {
                const reviewId = $(this).find('.original-review strong').text().split(': ')[1];
                
                const promise = $.ajax({
                    url: `/api/reviews/${reviewId}`,
                    type: 'DELETE'
                });
                
                deletePromises.push(promise);
            });

            Promise.all(deletePromises)
                .then(() => {
                    alert('모든 리뷰가 삭제되었습니다.');
                    location.reload();
                })
                .catch(() => {
                    alert('일부 리뷰 삭제에 실패했습니다.');
                });
        }
    });

    document.getElementById('calculateButton').addEventListener('click', function() {
        calculateSimilarity();
    });
})