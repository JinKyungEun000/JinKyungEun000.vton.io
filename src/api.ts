export async function uploadImage(file: File): Promise<{ uploadUrl: string; resultUrl: string }> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch('http://localhost:4000/api/upload', {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error('업로드 실패');

  return res.json();   // { uploadUrl, resultUrl }
}

export async function fitImages(
  userUrl: string,
  clothUrl: string,
): Promise<{ resultUrl: string }> {
  const res = await fetch('http://localhost:5000/process', {  // 포트와 엔드포인트 수정
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      userPath: userUrl,    // 파라미터 이름 수정
      clothPath: clothUrl   // 파라미터 이름 수정
    }),
  });
  if (!res.ok) throw new Error('가상 피팅 실패');
  return res.json();
}