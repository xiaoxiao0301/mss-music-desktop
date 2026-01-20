export namespace backend {
	
	export class LoginResponse {
	    token: string;
	    refresh_token: string;
	
	    static createFrom(source: any = {}) {
	        return new LoginResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.token = source["token"];
	        this.refresh_token = source["refresh_token"];
	    }
	}

}

