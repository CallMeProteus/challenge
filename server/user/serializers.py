from rest_framework import serializers
from django.conf import settings
from django.contrib.auth import get_user_model
from web3 import Web3
from django.conf import settings

class RegistrationSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(style={"input_type": "password"})

    class Meta:
        model = get_user_model()
        fields = ("first_name", "last_name", "email", "password", "password2","ethereumAddress")
        extra_kwargs = {
            "password": {"write_only": True},
            "password2": {"write_only": True}
        }

    def save(self):
        user = get_user_model()(
            email=self.validated_data["email"],
            first_name=self.validated_data["first_name"],
            last_name=self.validated_data["last_name"],
            ethereumAddress=self.validated_data["ethereumAddress"]
        )

        password = self.validated_data["password"]
        password2 = self.validated_data["password2"]

        if password != password2:
            raise serializers.ValidationError(
                {"password": "Passwords do not match!"})

        user.set_password(password)
        user.save()

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        style={"input_type": "password"}, write_only=True)


class UserSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()
    class Meta:
        model = get_user_model()
        fields = ("id", "email", "is_staff", "first_name", "last_name", "ethereumAddress", "balance")
    def get_balance(self, obj):
        w3 = Web3(Web3.HTTPProvider(settings.INFURA_URL))
        try:
            balance_wei = w3.eth.get_balance(obj.ethereumAddress)
            balance_eth = w3.from_wei(balance_wei, 'ether')
            return float(balance_eth)
        except Exception as e:
            print(f"Error fetching balance: {e}")
            return None
