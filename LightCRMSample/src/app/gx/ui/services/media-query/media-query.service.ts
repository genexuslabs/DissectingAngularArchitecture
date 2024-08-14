import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { Subject } from "rxjs";

export type LayoutSize = "small" | "medium" | "large";

export const SMALL_LAYOUT: LayoutSize = "small";
export const MEDIUM_LAYOUT: LayoutSize = "medium";
export const LARGE_LAYOUT: LayoutSize = "large";

@Injectable({
    providedIn: 'root',
})
export class MediaQueryService {

  // Media queries
  private mediaQuerySmallLayout: MediaQueryList;
  private mediaQueryMediumLayout: MediaQueryList;
  private mediaQueryLargeLayout: MediaQueryList;

  updateCurrentLayoutSize = new Subject<{layoutSize:LayoutSize, isCurrentLayout:boolean}>();
  
  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {}

  start() {
    this.initializeMediaQueriesAndCurrentLayoutSize();
    this.startMediaQueryMonitoring();

    // If we are on a mobile device
    if (window.innerWidth <= 768) {
      this.adjustHeightOnMobileDevice();

      // We listen to the resize event
      window.addEventListener('resize', () => {
        this.adjustHeightOnMobileDevice();
      }, { passive: true });
    }
  }

  end() {
    this.endMediaQueryMonitoring();
  }

  initializeMediaQueriesAndCurrentLayoutSize() {
    // Parse breakpoints
    const breakpoints = "768 1200".split(" "); // SET THIS WITH A PROPERTY OR SOMETHING ELSE
    const breakpointSmall = breakpoints[0] + "px";
    const breakpointMedium = breakpoints[1] + "px";

    const breakpointSmallPlus1 = breakpoints[0] + ".1px";
    const breakpointMediumPlus1 = breakpoints[1] + ".1px";

    // Set media queries for breakpoint changes
    this.mediaQuerySmallLayout = window.matchMedia(
        `(max-width: ${breakpointSmall})`
    );
    this.mediaQueryMediumLayout = window.matchMedia(
        `(min-width: ${breakpointSmallPlus1}) and (max-width: ${breakpointMedium})`
    );
    this.mediaQueryLargeLayout = window.matchMedia(
        `(min-width: ${breakpointMediumPlus1})`
    );

    // Set the current layout size
    this.updateCurrentLayoutSize.next({
      layoutSize: SMALL_LAYOUT, 
      isCurrentLayout: this.mediaQuerySmallLayout.matches
    });
    this.updateCurrentLayoutSize.next({
      layoutSize: MEDIUM_LAYOUT,
      isCurrentLayout: this.mediaQueryMediumLayout.matches
    });
    this.updateCurrentLayoutSize.next({
      layoutSize: LARGE_LAYOUT,
      isCurrentLayout:this.mediaQueryLargeLayout.matches
    });
  }

  /**
   * Observe breakpoint changes.
   */
  private startMediaQueryMonitoring() {
    this.mediaQuerySmallLayout.addEventListener(
        "change",
        this.handleBreakpointChange(SMALL_LAYOUT)
    );
    this.mediaQueryMediumLayout.addEventListener(
        "change",
        this.handleBreakpointChange(MEDIUM_LAYOUT)
    );
    this.mediaQueryLargeLayout.addEventListener(
        "change",
        this.handleBreakpointChange(LARGE_LAYOUT)
    );
  }
  
  /**
   * Remove media query event listeners when component is destroyed.
   */
  private endMediaQueryMonitoring() {
    this.mediaQuerySmallLayout.removeEventListener(
      "change",
      this.handleBreakpointChange(SMALL_LAYOUT)
    );
    this.mediaQueryMediumLayout.removeEventListener(
      "change",
      this.handleBreakpointChange(MEDIUM_LAYOUT)
    );
    this.mediaQueryLargeLayout.removeEventListener(
      "change",
      this.handleBreakpointChange(LARGE_LAYOUT)
    );
  }

  private adjustHeightOnMobileDevice() {
    const { innerHeight } = window;
    this.document.documentElement.style.setProperty('--vh', `${innerHeight}px`);
  }

  private handleBreakpointChange =
  (layoutSize: LayoutSize) => (event: MediaQueryListEvent) => {
    this.updateCurrentLayoutSize.next({
      layoutSize:layoutSize, 
      isCurrentLayout: event.matches
    });
  };

   
}