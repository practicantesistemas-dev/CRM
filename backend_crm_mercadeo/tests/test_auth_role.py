from types import SimpleNamespace

from app.modules.auth.service import _rol


def test_rol_devuelve_el_valor_exacto_de_portal_rol():
    assert _rol(SimpleNamespace(portal_rol="ADMIN")) == "ADMIN"
    assert _rol(SimpleNamespace(portal_rol="GESTOR")) == "GESTOR"
    assert _rol(SimpleNamespace(portal_rol="USUARIO")) == "USUARIO"
    assert _rol(SimpleNamespace(portal_rol="Operador")) == "Operador"
