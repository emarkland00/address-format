import axios, { AxiosResponse } from 'axios';

const API_URL_BASE = 'https://api.opencagedata.com';
const API_URL_PATH = '/geocode/v1/json';
const API_PARAM_LANGUAGE = 'en';

export interface OpenCageAddressComponents {
    house_number?: string;
    road?: string;
    city?: string;
    suburb?: string;
    county?: string;
    town?: string;
    state_code?: string;
    postalCode?: string;
    postcode?: string;
    country?: string;
    'ISO_3166-1_alpha-2'?: string;
    'ISO_3166-1_alpha-3'?: string;
}

export interface NormalizedAddress {
    streetNumber: string;
    streetName: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    countryCode: string;
    countryAbbreviation: string | undefined;
}

export type GeoCageApiServiceClient = (query: string) => Promise<AxiosResponse>;

export class GeocageApiService {
    private apiKey: string;
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private init(): void {
        if (!this.apiKey) {
            throw Error('Must have an API key');
        }
    }

    /**
     * Gets the client that can be used for making API calls
     * @returns {string => Promise<AxiosResponse>} A function for making service calls
     */
    getClient(): GeoCageApiServiceClient {
        this.init();
        return (query: string): Promise<AxiosResponse> => {
            if (!query) {
                throw Error('Must have a valid query');
            }
    
            const url = `${API_URL_BASE}${API_URL_PATH}?q=${query}&key=${this.apiKey}&language=${API_PARAM_LANGUAGE}`;
            return axios.get(url);
        };    
    }

    static GetInstance(apiKey: string): GeocageApiService {
        return new GeocageApiService(apiKey);
    }

    /**
    * Takes the geocage address representation and normalizes it
    * @param {object} addressComponents - The address components from the geocage api
    * @return {object} A normalized representation of the address components
    */
    static normalizeGeocageAddress(addressComponents: OpenCageAddressComponents): NormalizedAddress {
       const normalizedAddress = {
           streetNumber: `${addressComponents.house_number || ''}`,
           streetName: addressComponents.road || '',
           address1: `${addressComponents.house_number || ''} ${addressComponents.road || ''}`.trim(),
           city: addressComponents.city || addressComponents.suburb || addressComponents.county || addressComponents.town || '',
           state: addressComponents.state_code || '',
           postalCode: addressComponents.postalCode || '',
           country: addressComponents.country || '',
           countryCode: addressComponents['ISO_3166-1_alpha-2'] || '',
           countryAbbreviation: addressComponents['ISO_3166-1_alpha-3'],
       };
       return normalizedAddress;
   }
}