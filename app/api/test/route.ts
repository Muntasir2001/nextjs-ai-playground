import fs from 'fs';
import FormData from 'form-data';
import http from 'http';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const request = await fetch('http://127.0.0.1:8000/process_file', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				access_token: 'token',
				file_id: 'token',
				mime_type: 'application/pdf',
				file_name: 'PS2.pdf',
			}),
		});

		// console.log('request', request);
		const data = await request.json();
		console.log('data', data);

		return NextResponse.json({ data: 'data' });
	} catch (error: any) {
		console.error('error', error);
	}
}
