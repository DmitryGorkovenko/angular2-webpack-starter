import { HttpModule } from '@angular/http';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';

import { ENV_PROVIDERS } from './environment';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard.component';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroesComponent } from './heroes.component';
import { HeroService } from './hero.service';

import { AppRoutingModule } from './app-routing.module';

type StoreType = {
	state: void,
	restoreInputValues: () => void,
	disposeOldHosts: () => void
};

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule
	],
	declarations: [
		AppComponent,
		DashboardComponent,
		HeroDetailComponent,
		HeroesComponent
	],
	providers: [
		HeroService
	],
	bootstrap: [
		ENV_PROVIDERS,
		AppComponent
	]
})
export class AppModule {

	constructor(
		public appRef: ApplicationRef
		// ,public appState: AppState
	) {}

	public hmrOnInit(store: StoreType) {
		if (!store || !store.state) {
			return;
		}
		console.log('HMR store', JSON.stringify(store, null, 2));
		// set state
		// this.appState._state = store.state;
		// set input values
		if ('restoreInputValues' in store) {
			let restoreInputValues = store.restoreInputValues;
			setTimeout(restoreInputValues);
		}

		this.appRef.tick();
		delete store.state;
		delete store.restoreInputValues;
	}

	public hmrOnDestroy(store: StoreType) {
		const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
		// save state
		// const state = this.appState._state;
		// store.state = state;
		// recreate root elements
		store.disposeOldHosts = createNewHosts(cmpLocation);
		// save input values
		store.restoreInputValues  = createInputTransfer();
		// remove styles
		removeNgStyles();
	}

	public hmrAfterDestroy(store: StoreType) {
		// display new elements
		store.disposeOldHosts();
		delete store.disposeOldHosts;
	}

}