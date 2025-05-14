import Steps from './steps';
import Advert from '../Advert';
import { getAllListings } from '@/src/services/Listings';
import Loading from '../Loading';

export default async function HomeComponent() {
    const response = await getAllListings();
    if (!response || !response.data || response.data.length === 0) {
        return <Loading />;
    }
    const adverts = response?.data || [];


    return (
        <div className="flex flex-col h-full py-4 px-10">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {adverts.map((advert) => (
                    <Advert userId={advert?.user_id} key={advert._id} pet={advert} />
                ))}
            </div>
            <div className="mt-10">
                <Steps />
            </div>
        </div>
    );
}
