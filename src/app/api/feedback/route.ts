import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import crypto from 'crypto';

const RATE_LIMIT_MS = 60000; // 1 per minute
const ipLastSubmit = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    
    // Rate limit
    const last = ipLastSubmit.get(ip) || 0;
    if (now - last < RATE_LIMIT_MS) {
      return NextResponse.json({ error: '잠시 후 다시 시도해주세요' }, { status: 429 });
    }
    
    const body = await request.json();
    const { category, message, pageUrl } = body;
    
    if (!message || message.trim().length < 5) {
      return NextResponse.json({ error: '내용을 5자 이상 입력해주세요' }, { status: 400 });
    }
    
    if (!['bug', 'inconvenience', 'suggestion'].includes(category)) {
      return NextResponse.json({ error: '올바른 카테고리를 선택해주세요' }, { status: 400 });
    }
    
    const ipHash = crypto.createHash('sha256').update(ip + 'feedback-salt').digest('hex').slice(0, 16);
    const userAgent = request.headers.get('user-agent') || '';
    
    await pool.query(
      'INSERT INTO feedback (category, message, page_url, user_agent, ip_hash) VALUES ($1, $2, $3, $4, $5)',
      [category, message.trim().slice(0, 2000), pageUrl || '', userAgent.slice(0, 500), ipHash]
    );
    
    ipLastSubmit.set(ip, now);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
  }
}
