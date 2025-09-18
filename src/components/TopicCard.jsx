import React from 'react';
import { Link } from 'react-router-dom';

export default function TopicCard({ topic }) {
  // 토픽에 포함된 페이지 중 첫 번째 페이지의 내용을 미리보기로 사용합니다.
  const previewContent = topic.pages[0]?.content
    ? topic.pages[0].content.substring(0, 100) + (topic.pages[0].content.length > 100 ? '...' : '')
    : '이 토픽에는 아직 페이지가 없습니다.'; // 내용이 100자 넘으면 ... 추가

  return (
    <Link to={`/topics/${topic.id}`} className="block h-full bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-gray-200">
      <div className="flex items-start"> {/* 아이콘과 텍스트를 한 줄에 정렬 */}
        {/* SVG 아이콘 (이미지의 i 아이콘) */}
        <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        
        <div className="flex-1"> {/* 텍스트 부분이 남은 공간을 채우도록 */}
          {/* 토픽의 이름을 표시합니다. */}
          <h3 className="text-lg font-bold text-gray-900 mb-2">Title: {topic.name}</h3> {/* "Title:" 추가 */}
          {/* 첫 번째 페이지의 내용을 미리보기로 표시합니다. */}
          <p className="text-sm text-gray-600 leading-relaxed">{previewContent}</p>
        </div>
      </div>
    </Link>
  );
}