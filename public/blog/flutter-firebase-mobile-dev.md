---
title: "Flutter + Firebase: Building FarmLink's Real-Time Supply Chain"
date: "2026-02-10"
tags: ["Flutter", "Firebase", "Mobile", "Google Maps", "Real-Time"]
excerpt: "How I built a multi-role agricultural supply chain app with Flutter, Firebase, real-time GPS tracking, and multilingual support for Sri Lankan farmers."
readingTime: 7
---

# Flutter + Firebase: Building FarmLink's Real-Time Supply Chain

**FarmLink** is a mobile app I built to connect farmers, distributors, transporters, and consumers through a unified platform. Here's a deep dive into the architecture and key technical decisions.

## Why Flutter?

When I needed to support both Android and iOS with a single codebase, Flutter was the obvious choice:

- **Single codebase** for Android and iOS
- **Native performance** via Dart compilation
- **Rich widget library** for beautiful UIs
- **Excellent Firebase integration** via FlutterFire

## App Architecture

```
lib/
├── main.dart
├── app/
│   ├── routes.dart
│   └── theme.dart
├── features/
│   ├── auth/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── market/          # Crop auctions
│   ├── logistics/       # GPS tracking
│   ├── weather/         # Weather insights
│   └── notifications/
├── core/
│   ├── services/
│   └── utils/
└── shared/
    └── widgets/
```

## Firebase Setup

```dart
// main.dart
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const FarmLinkApp());
}
```

## Real-Time GPS Tracking

The most complex feature was real-time delivery tracking for transporters.

```dart
// logistics_service.dart
class LogisticsService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Transporter updates their location every 5 seconds
  StreamSubscription<Position>? _positionStream;

  void startTracking(String deliveryId) {
    _positionStream = Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10, // Update every 10 meters
      ),
    ).listen((Position position) {
      _db.collection('deliveries').doc(deliveryId).update({
        'currentLocation': GeoPoint(position.latitude, position.longitude),
        'updatedAt': FieldValue.serverTimestamp(),
        'speed': position.speed,
      });
    });
  }

  // Consumer listens to delivery updates
  Stream<DocumentSnapshot> trackDelivery(String deliveryId) {
    return _db.collection('deliveries').doc(deliveryId).snapshots();
  }
}
```

## Google Maps Integration

```dart
// delivery_map_widget.dart
class DeliveryMapWidget extends StatefulWidget {
  final String deliveryId;
  const DeliveryMapWidget({required this.deliveryId, super.key});

  @override
  State<DeliveryMapWidget> createState() => _DeliveryMapWidgetState();
}

class _DeliveryMapWidgetState extends State<DeliveryMapWidget> {
  final Set<Marker> _markers = {};

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<DocumentSnapshot>(
      stream: LogisticsService().trackDelivery(widget.deliveryId),
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const CircularProgressIndicator();
        
        final data = snapshot.data!.data() as Map<String, dynamic>;
        final location = data['currentLocation'] as GeoPoint;
        
        return GoogleMap(
          initialCameraPosition: CameraPosition(
            target: LatLng(location.latitude, location.longitude),
            zoom: 14,
          ),
          markers: {
            Marker(
              markerId: const MarkerId('transporter'),
              position: LatLng(location.latitude, location.longitude),
              icon: BitmapDescriptor.defaultMarkerWithHue(
                BitmapDescriptor.hueGreen,
              ),
            ),
          },
        );
      },
    );
  }
}
```

## Multilingual Support

Supporting Sinhala, Tamil, and English was crucial for farmer adoption.

```dart
// app_localizations.dart
class AppLocalizations {
  static const supportedLocales = [
    Locale('en'),
    Locale('si'), // Sinhala
    Locale('ta'), // Tamil
  ];
}

// l10n/app_si.arb
{
  "welcomeMessage": "ෆාම්ලින්ක් වෙත සාදරයෙන් පිළිගනිමු",
  "cropAuction": "බෝග වෙන්දේසිය",
  "trackDelivery": "බෙදා හැරීම් නිරීක්ෂණය"
}
```

## Key Takeaways

1. **Use Riverpod for state management** – cleaner than Provider for complex apps
2. **Firebase Security Rules are critical** – farmers should only see their own data
3. **Offline support matters in rural areas** – use `FirebaseFirestore.instance.settings` for persistence
4. **Test on real devices** – GPS emulation in simulators doesn't reflect real-world accuracy

## Conclusion

Building FarmLink taught me that great mobile apps require deep understanding of the user's environment. Rural farmers need offline support, low data usage, and multilingual interfaces. Flutter + Firebase made all of this achievable within a reasonable development timeline.
