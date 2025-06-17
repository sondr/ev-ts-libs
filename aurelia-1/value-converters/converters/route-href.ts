import { resolve, valueConverter } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@valueConverter('routeHref')
export class RouteHrefValueConverter {
  private readonly router = resolve(Router);

  /**
   * Converts a route and optional parameters into a URL string.
   * @param route The route name or path.
   * @param params Optional parameters to interpolate into the route.
   * @returns The generated URL string.
   */
  toView(route: string, params?: Record<string, any>): string {
    if (!route) {
      return '';
    }
    // If params are provided, interpolate them into the route
    if (params) {
      return this.router.generate(route, params);
    }
    // Otherwise, just return the route as is
    return this.router.generate(route);
  }
}
