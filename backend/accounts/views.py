from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from .models import User


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'bio': user.bio,
            'subject_or_expertise': user.subject_or_expertise,
        })
    

class TeacherListView(generics.ListAPIView):
    queryset = User.objects.filter(role='TEACHER')
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        from rest_framework import serializers as drf_serializers

        class TeacherSerializer(drf_serializers.ModelSerializer):
            class Meta:
                model = User
                fields = ['id', 'username', 'bio', 'subject_or_expertise']
        return TeacherSerializer


class TeacherDetailView(generics.RetrieveAPIView):
    queryset = User.objects.filter(role='TEACHER')
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        from rest_framework import serializers as drf_serializers

        class TeacherSerializer(drf_serializers.ModelSerializer):
            class Meta:
                model = User
                fields = ['id', 'username', 'bio', 'subject_or_expertise']
        return TeacherSerializer