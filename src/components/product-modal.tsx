"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent, TouchEvent } from "react";
import type { Product } from "@/data/products";
import { ChevronIcon, CloseIcon } from "./icons";

const MIN_SCALE = 1;
const DOUBLE_TAP_SCALE = 2.4;
const MAX_SCALE = 4;
const SWIPE_THRESHOLD = 56;

type Point = { x: number; y: number };
type Transform = { scale: number; x: number; y: number };
type TouchLike = { clientX: number; clientY: number };

const distance = (a: TouchLike, b: TouchLike) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
const midpoint = (a: TouchLike, b: TouchLike): Point => ({ x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 });
const clampScale = (value: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [transform, setTransform] = useState<Transform>({ scale: MIN_SCALE, x: 0, y: 0 });
  const gesture = useRef({
    startPoint: { x: 0, y: 0 },
    lastPoint: { x: 0, y: 0 },
    startDistance: 0,
    startMidpoint: { x: 0, y: 0 },
    startTransform: { scale: MIN_SCALE, x: 0, y: 0 },
    moved: false,
    pinching: false,
    lastTap: 0,
    pointerActive: false,
  });

  const move = useCallback(
    (direction: number) => setIndex((current) => (current + direction + product.images.length) % product.images.length),
    [product.images.length],
  );

  const toggleZoom = useCallback(() => {
    setTransform((current) => (current.scale > MIN_SCALE ? { scale: MIN_SCALE, x: 0, y: 0 } : { scale: DOUBLE_TAP_SCALE, x: 0, y: 0 }));
  }, []);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const first = event.touches[0];
    if (!first) return;

    if (event.touches.length === 2) {
      const second = event.touches[1];
      gesture.current = {
        ...gesture.current,
        startDistance: distance(first, second),
        startMidpoint: midpoint(first, second),
        startTransform: transform,
        moved: false,
        pinching: true,
      };
      return;
    }

    const point = { x: first.clientX, y: first.clientY };
    gesture.current = {
      ...gesture.current,
      startPoint: point,
      lastPoint: point,
      startTransform: transform,
      moved: false,
      pinching: false,
    };
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const first = event.touches[0];
    if (!first) return;

    if (event.touches.length === 2) {
      event.preventDefault();
      const second = event.touches[1];
      const currentDistance = distance(first, second);
      const currentMidpoint = midpoint(first, second);
      const nextScale = clampScale((gesture.current.startTransform.scale * currentDistance) / Math.max(gesture.current.startDistance, 1));
      const midpointDelta = {
        x: currentMidpoint.x - gesture.current.startMidpoint.x,
        y: currentMidpoint.y - gesture.current.startMidpoint.y,
      };

      gesture.current.moved = true;
      setTransform({
        scale: nextScale,
        x: gesture.current.startTransform.x + midpointDelta.x,
        y: gesture.current.startTransform.y + midpointDelta.y,
      });
      return;
    }

    const point = { x: first.clientX, y: first.clientY };
    const dx = point.x - gesture.current.startPoint.x;
    const dy = point.y - gesture.current.startPoint.y;

    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) gesture.current.moved = true;

    if (transform.scale > MIN_SCALE) {
      event.preventDefault();
      setTransform({
        scale: transform.scale,
        x: gesture.current.startTransform.x + dx,
        y: gesture.current.startTransform.y + dy,
      });
    }

    gesture.current.lastPoint = point;
  };

  const handleTouchEnd = () => {
    if (gesture.current.pinching) {
      gesture.current.pinching = false;
      return;
    }

    const dx = gesture.current.lastPoint.x - gesture.current.startPoint.x;
    const dy = gesture.current.lastPoint.y - gesture.current.startPoint.y;
    const now = Date.now();

    if (!gesture.current.moved && now - gesture.current.lastTap < 280) {
      gesture.current.lastTap = 0;
      toggleZoom();
      return;
    }

    if (!gesture.current.moved) {
      gesture.current.lastTap = now;
      return;
    }

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      move(dx < 0 ? 1 : -1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const point = { x: event.clientX, y: event.clientY };
    gesture.current = {
      ...gesture.current,
      startPoint: point,
      lastPoint: point,
      startTransform: transform,
      moved: false,
      pointerActive: true,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || !gesture.current.pointerActive) return;

    const point = { x: event.clientX, y: event.clientY };
    const dx = point.x - gesture.current.startPoint.x;
    const dy = point.y - gesture.current.startPoint.y;

    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) gesture.current.moved = true;

    if (transform.scale > MIN_SCALE) {
      setTransform({
        scale: transform.scale,
        x: gesture.current.startTransform.x + dx,
        y: gesture.current.startTransform.y + dy,
      });
    }

    gesture.current.lastPoint = point;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || !gesture.current.pointerActive) return;
    gesture.current.pointerActive = false;

    const dx = gesture.current.lastPoint.x - gesture.current.startPoint.x;
    const dy = gesture.current.lastPoint.y - gesture.current.startPoint.y;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      move(dx < 0 ? 1 : -1);
    }
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };

    window.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      window.removeEventListener("keydown", keydown);
    };
  }, [move, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black p-0 text-white backdrop-blur-sm lg:bg-black/85 lg:p-6"
    >
      <div className="modal-in relative flex h-[100svh] w-screen flex-col overflow-hidden bg-black lg:grid lg:h-[min(92vh,900px)] lg:w-full lg:max-w-6xl lg:grid-cols-[1fr_320px] lg:bg-white">
        <div
          className="relative flex min-h-0 flex-1 touch-none select-none items-center justify-center overflow-hidden bg-black lg:h-full lg:w-full lg:bg-[#eeeae3]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={toggleZoom}
        >
          <div
            className="relative h-full max-h-[90svh] w-full max-w-[100vw] transition-transform duration-150 ease-out lg:max-h-none lg:max-w-none"
            style={{ transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})` }}
          >
            <Image
              src={product.images[index]}
              alt={`${product.name}, foto ${index + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 70vw"
              quality={100}
              unoptimized
              className="object-contain"
              priority
            />
          </div>
        </div>

        <button onClick={onClose} className="absolute right-3 top-3 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-black shadow-md lg:hidden" aria-label="Fechar">
          <CloseIcon className="h-5 w-5" />
        </button>

        <aside className="pointer-events-auto relative z-10 flex max-h-[46svh] shrink-0 flex-col overflow-hidden border-t border-white/10 bg-black px-3 pb-[calc(.75rem+env(safe-area-inset-bottom))] pt-3 text-white lg:static lg:col-start-2 lg:row-start-1 lg:max-h-none lg:min-h-0 lg:border-l lg:border-t-0 lg:border-[#C8A45D]/25 lg:bg-[#fbf7ef] lg:bg-none lg:p-8 lg:text-[#171714] lg:shadow-[-28px_0_70px_rgba(23,23,20,.08)]">
          <button onClick={onClose} className="hidden h-10 w-10 items-center justify-center self-end rounded-full border border-black/10 bg-white text-black shadow-sm transition hover:border-[#C8A45D]/70 hover:text-[#9a7739] lg:flex" aria-label="Fechar">
            <CloseIcon className="h-5 w-5" />
          </button>

          <div className="pointer-events-auto min-h-0 overflow-y-auto pr-16 lg:flex-1 lg:pr-1">
            <div className="hidden h-px w-14 bg-[#C8A45D] lg:mb-8 lg:block" />
            {product.collection && <p className="mb-1.5 text-[.58rem] font-bold uppercase tracking-[.22em] text-[#C8A45D] lg:mb-3 lg:text-[.62rem] lg:text-[#9a7739]">{product.collection}</p>}
            <h2 className="display line-clamp-2 text-[1.25rem] font-medium leading-[1.02] text-white drop-shadow-sm lg:line-clamp-none lg:text-[2.35rem] lg:text-[#171714] lg:drop-shadow-none">{product.name}</h2>
            {product.description && (
              <p className="mt-3 inline-flex max-w-full rounded-full border border-[#C8A45D]/70 bg-[#120f0a]/95 px-4 py-2.5 text-[.68rem] font-semibold uppercase leading-[1.35] tracking-[.1em] text-[#fff7e7] shadow-[0_14px_35px_rgba(0,0,0,.26)] backdrop-blur lg:mt-5 lg:bg-[#171714] lg:px-5 lg:py-3 lg:text-[.74rem] lg:tracking-[.11em]">
                {product.description}
              </p>
            )}
            <div className="mt-3 grid max-w-[15rem] grid-cols-2 overflow-hidden rounded-2xl border border-[#C8A45D]/45 bg-white/95 text-[#171714] shadow-[0_18px_45px_rgba(0,0,0,.18)] lg:mt-5 lg:max-w-[18rem] lg:bg-[#171714] lg:text-[#fff7e7]">
              <div className="border-r border-[#C8A45D]/35 px-3 py-2 lg:px-4 lg:py-3">
                <span className="block text-[.56rem] font-bold uppercase tracking-[.18em] text-[#9a7739] lg:text-[.62rem]">Cartão</span>
                <strong className="mt-1 block text-sm font-semibold lg:text-base">{formatCurrency(product.price)}</strong>
              </div>
              <div className="px-3 py-2 lg:px-4 lg:py-3">
                <span className="block text-[.56rem] font-bold uppercase tracking-[.18em] text-[#C8A45D] lg:text-[.62rem]">Pix</span>
                <strong className="mt-1 block text-sm font-semibold lg:text-base">{formatCurrency(product.pixPrice)}</strong>
              </div>
            </div>
            {product.details && (
              <div className="mt-4 space-y-3 rounded-3xl border border-white/15 bg-white/[.06] p-4 text-sm leading-6 text-white/86 backdrop-blur lg:mt-5 lg:border-[#C8A45D]/25 lg:bg-white/60 lg:text-black/68">
                {product.material && (
                  <p className="text-[.68rem] font-bold uppercase tracking-[.18em] text-[#C8A45D] lg:text-[#9a7739]">Material: {product.material}</p>
                )}
                {product.details.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
                {product.dimensions && <p className="font-semibold text-white lg:text-[#171714]">{product.dimensions}</p>}
                {product.features && (
                  <ul className="space-y-1.5 pt-1">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#C8A45D]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <p className="mt-5 hidden text-[.95rem] leading-7 text-black/65 lg:block">Conheça cada detalhe desta peça SKAD. Fale conosco para consultar cores e disponibilidade.</p>
          </div>

          <div className="pointer-events-auto mt-3 flex shrink-0 items-center justify-between border-t border-white/15 bg-black pt-3 lg:mt-6 lg:bg-transparent lg:border-[#C8A45D]/30 lg:pt-5">
            <span className="text-xs tracking-[.2em] text-white/70 lg:font-semibold lg:text-[#9a7739]">
              {String(index + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}
            </span>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                <button onClick={() => move(-1)} className="flex h-12 w-12 items-center justify-center border border-white/25 bg-black/20 text-white backdrop-blur transition hover:bg-white hover:text-black lg:h-11 lg:w-11 lg:border-[#171714] lg:bg-[#171714] lg:text-[#f8f1e6] lg:hover:border-[#C8A45D] lg:hover:bg-[#C8A45D] lg:hover:text-[#171714]" aria-label="Foto anterior">
                  <ChevronIcon className="h-5 w-5 rotate-180" />
                </button>
                <button onClick={() => move(1)} className="flex h-12 w-12 items-center justify-center border border-white/25 bg-black/20 text-white backdrop-blur transition hover:bg-white hover:text-black lg:h-11 lg:w-11 lg:border-[#171714] lg:bg-[#171714] lg:text-[#f8f1e6] lg:hover:border-[#C8A45D] lg:hover:bg-[#C8A45D] lg:hover:text-[#171714]" aria-label="Próxima foto">
                  <ChevronIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
