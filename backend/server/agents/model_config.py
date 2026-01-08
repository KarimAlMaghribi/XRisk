"""
xrisk - Model Configuration Wrapper
Author: Manuel Schott

Wrapper class for handling model-specific configuration differences
between GPT-4o, GPT-5, and other OpenAI models
"""

from typing import Dict, Any, Optional
import logging

logger = logging.getLogger('celery')

class ModelConfigWrapper:
    """
    Wrapper class to handle model-specific configuration differences
    """
    
    # Model-specific capabilities and limitations
    MODEL_CAPABILITIES = {
        'gpt-5': {
            'supports_temperature': False,  # Only supports default (1)
            'supports_max_tokens': False,   # Uses max_completion_tokens
            'supports_service_tier': True,  # Supports flex
            'default_temperature': 1.0,
            'max_completion_tokens_param': True
        },
        'gpt-4o': {
            'supports_temperature': True,
            'supports_max_tokens': True,
            'supports_service_tier': False,
            'default_temperature': 0.7,
            'max_completion_tokens_param': False
        },
        'gpt-4o-mini': {
            'supports_temperature': True,
            'supports_max_tokens': True,
            'supports_service_tier': False,
            'default_temperature': 0.7,
            'max_completion_tokens_param': False
        },
        'o3': {
            'supports_temperature': True,
            'supports_max_tokens': False,   # Uses max_completion_tokens
            'supports_service_tier': True,  # Supports flex
            'default_temperature': 0.7,
            'max_completion_tokens_param': True
        },
        'o4-mini': {
            'supports_temperature': True,
            'supports_max_tokens': False,   # Uses max_completion_tokens
            'supports_service_tier': True,  # Supports flex
            'default_temperature': 0.7,
            'max_completion_tokens_param': True
        },
        'gpt-3.5-turbo': {
            'supports_temperature': True,
            'supports_max_tokens': True,
            'supports_service_tier': False,
            'default_temperature': 0.7,
            'max_completion_tokens_param': False
        }
    }
    
    def __init__(self, model: str):
        """
        Initialize the model configuration wrapper
        
        Args:
            model (str): The OpenAI model name
        """
        self.model = model
        self.capabilities = self.MODEL_CAPABILITIES.get(model, {
            'supports_temperature': True,
            'supports_max_tokens': True,
            'supports_service_tier': False,
            'default_temperature': 0.7,
            'max_completion_tokens_param': False
        })
        
        logger.debug(f"ModelConfigWrapper initialized for {model}")
        logger.debug(f"Capabilities: {self.capabilities}")
    
    def get_temperature(self, requested_temperature: float) -> Optional[float]:
        """
        Get the appropriate temperature value for the model
        
        Args:
            requested_temperature (float): The requested temperature value
            
        Returns:
            Optional[float]: The temperature to use, or None if not supported
        """
        if not self.capabilities['supports_temperature']:
            logger.debug(f"Model {self.model} does not support custom temperature. Using default.")
            return None
        
        return requested_temperature
    
    def get_max_tokens_param(self, max_tokens: int) -> Dict[str, Any]:
        """
        Get the appropriate max tokens parameter for the model
        
        Args:
            max_tokens (int): The requested max tokens value (ignored, no parameters returned)
            
        Returns:
            Dict[str, Any]: Empty dictionary - no max tokens parameters used
        """
        # No max tokens parameters - controlled by prompt instead
        return {}
    
    def get_service_tier(self, requested_service_tier: str) -> Optional[str]:
        """
        Get the appropriate service tier for the model
        
        Args:
            requested_service_tier (str): The requested service tier
            
        Returns:
            Optional[str]: The service tier to use, or None if not supported
        """
        if not self.capabilities['supports_service_tier']:
            logger.debug(f"Model {self.model} does not support service tier. Ignoring.")
            return None
        
        return requested_service_tier
    
    def get_request_params(self, 
                          messages: list,
                          temperature: float,
                          max_tokens: int,
                          service_tier: str = None) -> Dict[str, Any]:
        """
        Get the complete request parameters for the model
        
        Args:
            messages (list): The messages for the API call
            temperature (float): The requested temperature
            max_tokens (int): The requested max tokens
            service_tier (str): The requested service tier
            
        Returns:
            Dict[str, Any]: Complete request parameters for the API call
        """
        params = {
            'model': self.model,
            'messages': messages
        }
        
        # Handle temperature
        temp = self.get_temperature(temperature)
        if temp is not None:
            params['temperature'] = temp
        
        # Handle max tokens
        params.update(self.get_max_tokens_param(max_tokens))
        
        # Handle service tier
        if service_tier:
            tier = self.get_service_tier(service_tier)
            if tier:
                params['service_tier'] = tier
        
        logger.debug(f"Generated request params for {self.model}: {list(params.keys())}")
        return params
    
    def get_model_info(self) -> Dict[str, Any]:
        """
        Get information about the model's capabilities
        
        Returns:
            Dict[str, Any]: Model capability information
        """
        return {
            'model': self.model,
            'capabilities': self.capabilities,
            'supports_temperature': self.capabilities['supports_temperature'],
            'supports_max_tokens': self.capabilities['supports_max_tokens'],
            'supports_service_tier': self.capabilities['supports_service_tier'],
            'uses_max_completion_tokens': self.capabilities['max_completion_tokens_param']
        }
    
    @classmethod
    def get_supported_models(cls) -> list:
        """
        Get list of all supported models
        
        Returns:
            list: List of supported model names
        """
        return list(cls.MODEL_CAPABILITIES.keys())
    
    @classmethod
    def is_model_supported(cls, model: str) -> bool:
        """
        Check if a model is supported
        
        Args:
            model (str): The model name to check
            
        Returns:
            bool: True if model is supported
        """
        return model in cls.MODEL_CAPABILITIES
