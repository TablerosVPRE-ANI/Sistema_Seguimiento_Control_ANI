// app/api/dashboard-data/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  // Este endpoint devolverá datos estáticos por ahora
  // En producción, conectarías con una base de datos real
  return NextResponse.json({
    message: 'Use localStorage del navegador'
  });
}