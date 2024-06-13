import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider as PaperProvider} from 'react-native-paper';

import {AuthProvider} from './src/shared/auth/contexts/auth.context';
import Screens from './src/screens';

function App(): JSX.Element {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <PaperProvider>
          <Screens />
        </PaperProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
